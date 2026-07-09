import {
  ArmorDef,
  BlockDef,
  CommandDef,
  EmoteDef,
  GlobalEventDef,
  ItemDef,
  MobDef,
  ProjectMeta,
  toClassName,
  toConstant
} from './utils'
import { ParsedProject } from './parser'

function pkgPath(pkg: string): string {
  return pkg.replace(/\./g, '/')
}

export function generateAllFiles(parsed: ParsedProject): Record<string, string> {
  const { meta, pkg, items, blocks, armors, mobs, emotes, commands, globalEvents } = parsed
  const files: Record<string, string> = {}
  const clientRoot = `src/client/java/${pkgPath(pkg)}`

  files['gradle.properties'] = generateGradleProperties(meta)
  files['build.gradle'] = generateBuildGradle(parsed)
  files[`src/main/java/${pkgPath(pkg)}/${toClassName(meta.modId)}Mod.java`] = generateMainMod(parsed)
  if (commands.length > 0) {
    files[`src/main/java/${pkgPath(pkg)}/ModCommands.java`] = generateModCommands(pkg, commands)
  }
  if (globalEvents.length > 0 || blocks.some((b) => b.breakActions.length > 0)) {
    files[`src/main/java/${pkgPath(pkg)}/ModEvents.java`] = generateModEvents(pkg, globalEvents, blocks)
  }
  files[`src/main/java/${pkgPath(pkg)}/ModItems.java`] = generateModItems(pkg, meta.modId, items, armors)
  files[`src/main/java/${pkgPath(pkg)}/ModBlocks.java`] = generateModBlocks(pkg, meta.modId, blocks)
  files[`src/main/java/${pkgPath(pkg)}/ModEntities.java`] = generateModEntities(pkg, meta.modId, mobs)
  files[`src/main/java/${pkgPath(pkg)}/ModParticles.java`] = generateModParticles(pkg, meta.modId)
  files[`src/main/java/${pkgPath(pkg)}/VisualEffects.java`] = generateVisualEffects(pkg)
  files[`src/main/java/${pkgPath(pkg)}/network/ScreenshakePayload.java`] = generateScreenshakePayload(
    pkg,
    meta.modId
  )
  files[`src/main/java/${pkgPath(pkg)}/network/VisualCodingNetworking.java`] = generateNetworking(
    pkg,
    meta.modId
  )
  files[`${clientRoot}/client/${toClassName(meta.modId)}ClientMod.java`] = generateClientMod(parsed)
  files[`${clientRoot}/client/network/ScreenshakeHandler.java`] = generateScreenshakeHandler(pkg)
  files[`src/main/java/${pkgPath(pkg)}/emote/EmoteHandler.java`] = generateEmoteHandler(pkg)
  files[`src/main/java/${pkgPath(pkg)}/emote/EmoteRegistry.java`] = generateEmoteRegistry(pkg, emotes)
  files[`src/main/java/${pkgPath(pkg)}/emote/EmotePlayer.java`] = generateEmotePlayer(pkg, meta.modId)

  for (const item of items) {
    files[`src/main/java/${pkgPath(pkg)}/item/${item.className}.java`] = generateItemClass(pkg, item)
    files[`src/main/resources/assets/${meta.modId}/models/item/${item.id}.json`] = generateItemModel(
      meta.modId,
      item
    )
  }

  for (const block of blocks) {
    files[`src/main/java/${pkgPath(pkg)}/block/${block.className}.java`] = generateBlockClass(
      pkg,
      block
    )
    files[`src/main/resources/assets/${meta.modId}/blockstates/${block.id}.json`] = generateBlockstate(
      meta.modId,
      block
    )
    files[`src/main/resources/assets/${meta.modId}/models/block/${block.id}.json`] = generateBlockModel(
      meta.modId,
      block
    )
    files[`src/main/resources/assets/${meta.modId}/models/item/${block.id}.json`] =
      generateBlockItemModel(meta.modId, block)
  }

  for (const armor of armors) {
    files[`src/main/java/${pkgPath(pkg)}/item/${armor.className}.java`] = generateArmorClass(pkg, armor)
    files[`src/main/resources/assets/${meta.modId}/models/item/${armor.id}.json`] = generateItemModel(
      meta.modId,
      { id: armor.id, texture: armor.texture }
    )
  }

  for (const mob of mobs) {
    files[`src/main/java/${pkgPath(pkg)}/entity/${mob.className}.java`] = generateMobEntity(pkg, mob)
    files[`${clientRoot}/client/renderer/${mob.className}Renderer.java`] = generateMobRenderer(pkg, mob)
    files[`${clientRoot}/client/model/${mob.className}Model.java`] = generateMobModel(pkg, meta.modId, mob)
  }

  for (const emote of emotes) {
    files[`src/main/java/${pkgPath(pkg)}/emote/${toClassName(emote.id)}Emote.java`] = generateEmoteClass(
      pkg,
      emote
    )
  }

  files['src/main/resources/fabric.mod.json'] = generateFabricModJson(pkg, meta, mobs.length > 0)
  files[`src/main/resources/assets/${meta.modId}/lang/en_us.json`] = generateLang(
    meta,
    items,
    blocks,
    armors,
    mobs,
    emotes
  )

  return files
}

function generateGradleProperties(meta: ProjectMeta): string {
  return `org.gradle.jvmargs=-Xmx2G
org.gradle.parallel=true
org.gradle.configuration-cache=false

minecraft_version=26.2
loader_version=0.19.3
loom_version=1.17-SNAPSHOT
fabric_api_version=0.154.2+26.2
geckolib_version=5.5.1

mod_version=1.0.0
maven_group=com.visualcoding
archives_base_name=${meta.modId}

mod_id=${meta.modId}
mod_name=${meta.modName}
`
}

function generateBuildGradle(parsed: ParsedProject): string {
  const { meta, mobs } = parsed
  const geckoRepo = mobs.length
    ? `
repositories {
    maven {
        name = 'GeckoLib'
        url = 'https://dl.cloudsmith.io/public/geckolib3/geckolib/maven/'
        content {
            includeGroupByRegex("software\\\\.bernie.*")
            includeGroup("com.eliotlash.mclib")
            includeGroup("com.geckolib")
        }
    }
}`
    : ''

  const geckoDeps = mobs.length
    ? `
    implementation "com.geckolib:geckolib-fabric-\${minecraft_version}:\${geckolib_version}"
    implementation "com.eliotlash.mclib:mclib:20"`
    : ''

  return `plugins {
    id 'net.fabricmc.fabric-loom' version "\${loom_version}"
    id 'maven-publish'
    id 'java'
}

version = project.mod_version
group = project.maven_group

base {
    archivesName = project.archives_base_name
}
${geckoRepo}

loom {
    splitEnvironmentSourceSets()

    mods {
        "\${mod_id}" {
            sourceSet sourceSets.main
            sourceSet sourceSets.client
        }
    }
}

dependencies {
    minecraft "com.mojang:minecraft:\${minecraft_version}"
    implementation "net.fabricmc:fabric-loader:\${loader_version}"
    implementation "net.fabricmc.fabric-api:fabric-api:\${fabric_api_version}"${geckoDeps}
}

processResources {
    inputs.property "version", project.version
    filesMatching("fabric.mod.json") {
        expand "version": project.version
    }
}

tasks.withType(JavaCompile).configureEach {
    it.options.release = 25
}

java {
    withSourcesJar()
    sourceCompatibility = JavaVersion.VERSION_25
    targetCompatibility = JavaVersion.VERSION_25
}

jar {
    from("LICENSE") {
        rename { "\${it}_\${project.base.archivesName.get()}" }
    }
}
`
}

function generateFabricModJson(pkg: string, meta: ProjectMeta, hasMobs: boolean): string {
  const depends: Record<string, string> = {
    fabricloader: '>=0.19.0',
    minecraft: '~26.2',
    java: '>=25',
    'fabric-api': '*'
  }
  if (hasMobs) depends.geckolib = '*'

  return JSON.stringify(
    {
      schemaVersion: 1,
      id: meta.modId,
      version: '1.0.0',
      name: meta.modName,
      description: `Generated by VisualCoding for Minecraft ${meta.minecraftVersion}`,
      authors: ['VisualCoding'],
      license: 'MIT',
      environment: '*',
      entrypoints: {
        main: [`${pkg}.${toClassName(meta.modId)}Mod`],
        client: [`${pkg}.client.${toClassName(meta.modId)}ClientMod`]
      },
      depends
    },
    null,
    2
  )
}

function generateLang(
  meta: ProjectMeta,
  items: ItemDef[],
  blocks: BlockDef[],
  armors: ArmorDef[],
  mobs: MobDef[],
  emotes: EmoteDef[]
): string {
  const lang: Record<string, string> = {}
  for (const item of items) lang[`item.${meta.modId}.${item.id}`] = item.name
  for (const block of blocks) lang[`block.${meta.modId}.${block.id}`] = block.name
  for (const armor of armors) lang[`item.${meta.modId}.${armor.id}`] = armor.name
  for (const mob of mobs) lang[`entity.${meta.modId}.${mob.id}`] = mob.name
  for (const emote of emotes) lang[`emote.${meta.modId}.${emote.id}`] = emote.name
  return JSON.stringify(lang, null, 2)
}

function generateMainMod(parsed: ParsedProject): string {
  const { pkg, meta, emotes, mobs, commands, globalEvents, blocks } = parsed
  const className = `${toClassName(meta.modId)}Mod`
  const emoteRegistrations = emotes
    .map((e) => `        EmoteRegistry.register("${e.command}", new ${toClassName(e.id)}Emote());`)
    .join('\n')
  const attrRegs = mobs
    .map(
      (m) =>
        `        FabricDefaultAttributeRegistry.register(ModEntities.${toConstant(m.id)}, ${m.className}.createAttributes());`
    )
    .join('\n')
  const hasModEvents = globalEvents.length > 0 || blocks.some((b) => b.breakActions.length > 0)
  const modEventsImport = hasModEvents ? `import ${pkg}.ModEvents;\n` : ''
  const modCommandsImport = commands.length > 0 ? `import ${pkg}.ModCommands;\n` : ''

  return `package ${pkg};

import ${pkg}.emote.*;
import ${pkg}.network.VisualCodingNetworking;
${modEventsImport}${modCommandsImport}import net.fabricmc.api.ModInitializer;
import net.fabricmc.fabric.api.object.builder.v1.entity.FabricDefaultAttributeRegistry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ${className} implements ModInitializer {
    public static final String MOD_ID = "${meta.modId}";
    public static final Logger LOGGER = LoggerFactory.getLogger(MOD_ID);

    @Override
    public void onInitialize() {
        ModItems.register();
        ModBlocks.register();
        ModEntities.register();
        ModParticles.register();
${attrRegs || '        // No mob attributes'}
        VisualCodingNetworking.registerServer();
${hasModEvents ? '        ModEvents.register();' : ''}
${commands.length ? '        ModCommands.register();' : ''}
${emoteRegistrations || '        // No emotes'}
${emotes.length ? '        EmoteRegistry.registerCommands();' : ''}

        LOGGER.info("${meta.modName} loaded!");
    }
}
`
}

function generateModItems(pkg: string, modId: string, items: ItemDef[], armors: ArmorDef[]): string {
  if (items.length === 0 && armors.length === 0) {
    return `package ${pkg};

public class ModItems {
    public static final String MOD_ID = ${toClassName(modId)}Mod.MOD_ID;

    public static void register() {}
}
`
  }

  const itemRegs = items
    .map((i) => `        ${toConstant(i.id)} = registerItem("${i.id}", ${i.className}::new);`)
    .join('\n')
  const armorRegs = armors
    .map((a) => `        ${toConstant(a.id)} = registerItem("${a.id}", ${a.className}::new);`)
    .join('\n')
  const itemFields = items.map((i) => `    public static Item ${toConstant(i.id)};`).join('\n')
  const armorFields = armors.map((a) => `    public static Item ${toConstant(a.id)};`).join('\n')

  return `package ${pkg};

import ${pkg}.item.*;
import net.minecraft.core.Registry;
import net.minecraft.core.registries.BuiltInRegistries;
import net.minecraft.core.registries.Registries;
import net.minecraft.resources.Identifier;
import net.minecraft.resources.ResourceKey;
import net.minecraft.world.item.Item;

import java.util.function.Function;

public class ModItems {
    public static final String MOD_ID = ${toClassName(modId)}Mod.MOD_ID;
${itemFields}
${armorFields}

    public static void register() {
${itemRegs || '        // No items'}
${armorRegs || '        // No armor'}
    }

    private static Item registerItem(String name, Function<Item.Properties, Item> factory) {
        ResourceKey<Item> key = ResourceKey.create(Registries.ITEM, Identifier.fromNamespaceAndPath(MOD_ID, name));
        Item item = factory.apply(new Item.Properties().setId(key));
        return Registry.register(BuiltInRegistries.ITEM, key, item);
    }
}
`
}

function generateItemClass(pkg: string, item: ItemDef): string {
  const hasUse = item.rightClickActions.length > 0 || item.shiftRightClickActions.length > 0
  const hasHit = item.hitEntityActions.length > 0

  const useMethod = hasUse
    ? `
    @Override
    public InteractionResult use(Level world, Player player, InteractionHand hand) {
        if (!world.isClientSide()) {
            if (player.isShiftKeyDown()) {
${item.shiftRightClickActions.length ? item.shiftRightClickActions.join('\n') : '                // No shift-right-click actions'}
            } else {
${item.rightClickActions.length ? item.rightClickActions.join('\n') : '                // No right-click actions'}
            }
        }
        return InteractionResult.SUCCESS;
    }`
    : ''

  const hitMethod = hasHit
    ? `
    @Override
    public boolean hurtEnemy(ItemStack stack, LivingEntity target, LivingEntity attacker) {
        if (attacker instanceof Player player && !player.level().isClientSide()) {
            Level world = player.level();
${item.hitEntityActions.join('\n')}
        }
        return super.hurtEnemy(stack, target, attacker);
    }`
    : ''

  const propsBuilder = item.food
    ? `super(settings.food(new FoodProperties.Builder().nutrition(${item.foodNutrition}).saturationModifier(${item.foodSaturation}f).build()).stacksTo(${item.maxStack}));`
    : `super(settings.stacksTo(${item.maxStack}));`

  return `package ${pkg}.item;

import net.minecraft.network.chat.Component;
import net.minecraft.sounds.SoundEvents;
import net.minecraft.sounds.SoundSource;
import net.minecraft.world.InteractionHand;
import net.minecraft.world.InteractionResult;
import net.minecraft.world.effect.MobEffectInstance;
import net.minecraft.world.effect.MobEffects;
import net.minecraft.world.entity.LivingEntity;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.food.FoodProperties;
import net.minecraft.world.item.Item;
import net.minecraft.world.item.ItemStack;
import net.minecraft.world.level.Level;
import ${pkg}.ModEntities;
import ${pkg}.ModItems;
import ${pkg}.ModParticles;
import ${pkg}.VisualEffects;

public class ${item.className} extends Item {
    public ${item.className}(Item.Properties settings) {
        ${propsBuilder}
    }
${useMethod}${hitMethod}
}
`
}

function generateModBlocks(pkg: string, modId: string, blocks: BlockDef[]): string {
  if (blocks.length === 0) {
    return `package ${pkg};

public class ModBlocks {
    public static final String MOD_ID = ${toClassName(modId)}Mod.MOD_ID;

    public static void register() {}
}
`
  }

  const regs = blocks
    .map((b) => `        ${toConstant(b.id)} = registerBlock("${b.id}", ${b.className}::new);`)
    .join('\n')
  const fields = blocks.map((b) => `    public static Block ${toConstant(b.id)};`).join('\n')

  return `package ${pkg};

import ${pkg}.block.*;
import net.minecraft.core.Registry;
import net.minecraft.core.registries.BuiltInRegistries;
import net.minecraft.core.registries.Registries;
import net.minecraft.resources.Identifier;
import net.minecraft.resources.ResourceKey;
import net.minecraft.world.level.block.Block;

import java.util.function.Function;

public class ModBlocks {
    public static final String MOD_ID = ${toClassName(modId)}Mod.MOD_ID;
${fields}

    public static void register() {
${regs || '        // No blocks'}
    }

    private static Block registerBlock(String name, Function<ResourceKey<Block>, Block> factory) {
        ResourceKey<Block> key = ResourceKey.create(Registries.BLOCK, Identifier.fromNamespaceAndPath(MOD_ID, name));
        Block block = factory.apply(key);
        return Registry.register(BuiltInRegistries.BLOCK, key, block);
    }
}
`
}

function generateBlockClass(pkg: string, block: BlockDef): string {
  const useMethod =
    block.interactActions.length > 0
      ? `
    @Override
    protected InteractionResult useWithoutItem(BlockState state, Level world, BlockPos pos, Player player, BlockHitResult hit) {
        if (!world.isClientSide()) {
${block.interactActions.join('\n')}
        }
        return InteractionResult.SUCCESS;
    }`
      : ''

  const stepMethod =
    block.stepOnActions.length > 0
      ? `
    @Override
    public void stepOn(Level world, BlockPos pos, BlockState state, Entity entity) {
        if (!world.isClientSide() && entity instanceof Player player) {
${block.stepOnActions.join('\n')}
        }
        super.stepOn(world, pos, state, entity);
    }`
      : ''

  const lightProp = block.lightLevel > 0 ? `.lightLevel(state -> ${block.lightLevel})` : ''

  return `package ${pkg}.block;

import net.minecraft.core.BlockPos;
import net.minecraft.network.chat.Component;
import net.minecraft.sounds.SoundEvents;
import net.minecraft.sounds.SoundSource;
import net.minecraft.world.InteractionResult;
import net.minecraft.world.effect.MobEffectInstance;
import net.minecraft.world.effect.MobEffects;
import net.minecraft.world.entity.Entity;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.level.Level;
import net.minecraft.resources.ResourceKey;
import net.minecraft.world.level.block.Block;
import net.minecraft.world.level.block.state.BlockBehaviour;
import net.minecraft.world.level.block.state.BlockState;
import net.minecraft.world.phys.BlockHitResult;
import ${pkg}.ModEntities;
import ${pkg}.ModItems;
import ${pkg}.ModParticles;
import ${pkg}.VisualEffects;

public class ${block.className} extends Block {
    public ${block.className}(ResourceKey<Block> key) {
        super(BlockBehaviour.Properties.of().setId(key).strength(${block.hardness}f)${lightProp});
    }
${useMethod}${stepMethod}
}
`
}

function generateModEntities(pkg: string, modId: string, mobs: MobDef[]): string {
  if (mobs.length === 0) {
    return `package ${pkg};

public class ModEntities {
    public static final String MOD_ID = ${toClassName(modId)}Mod.MOD_ID;

    public static void register() {}
}
`
  }

  const regs = mobs
    .map(
      (m) =>
        `        ${toConstant(m.id)} = registerEntity("${m.id}", EntityType.Builder.of(${m.className}::new, MobCategory.MONSTER).sized(0.9f, 1.8f));`
    )
    .join('\n')
  const fields = mobs.map((m) => `    public static EntityType<${m.className}> ${toConstant(m.id)};`).join('\n')

  return `package ${pkg};

import ${pkg}.entity.*;
import net.minecraft.core.Registry;
import net.minecraft.core.registries.BuiltInRegistries;
import net.minecraft.core.registries.Registries;
import net.minecraft.resources.Identifier;
import net.minecraft.resources.ResourceKey;
import net.minecraft.world.entity.EntityType;
import net.minecraft.world.entity.MobCategory;

public class ModEntities {
    public static final String MOD_ID = ${toClassName(modId)}Mod.MOD_ID;
${fields}

    public static void register() {
${regs || '        // No mobs'}
    }

    private static <T extends net.minecraft.world.entity.Entity> EntityType<T> registerEntity(
            String name,
            EntityType.Builder<T> builder) {
        ResourceKey<EntityType<?>> key = ResourceKey.create(Registries.ENTITY_TYPE, Identifier.fromNamespaceAndPath(MOD_ID, name));
        return Registry.register(BuiltInRegistries.ENTITY_TYPE, key, builder.build(key));
    }
}
`
}

function generateMobEntity(pkg: string, mob: MobDef): string {
  const goals: string[] = []
  if (mob.ai.fleeHealthPercent > 0) {
    goals.push(`        this.goalSelector.addGoal(1, new PanicGoal(this, 1.25));`)
  }
  if (mob.ai.rangedAttack) {
    goals.push(
      `        this.goalSelector.addGoal(1, new RangedAttackGoal(this, 1.0, 20, ${mob.ai.rangedRange}f));`
    )
  }
  goals.push(`        this.goalSelector.addGoal(2, new MeleeAttackGoal(this, 1.0, false));`)
  if (mob.ai.chaseRange > 0) {
    goals.push(
      `        this.targetSelector.addGoal(2, new NearestAttackableTargetGoal<>(this, Player.class, true));`
    )
  }
  if (mob.ai.wander) {
    goals.push('        this.goalSelector.addGoal(5, new RandomStrollGoal(this, 1.0));')
  }
  goals.push('        this.goalSelector.addGoal(7, new LookAtPlayerGoal(this, Player.class, 8.0f));')
  goals.push('        this.goalSelector.addGoal(8, new RandomLookAroundGoal(this));')

  const rangedInterface = mob.ai.rangedAttack ? ', RangedAttackMob' : ''
  const rangedImports = mob.ai.rangedAttack
    ? `import net.minecraft.world.entity.LivingEntity;
import net.minecraft.world.entity.monster.RangedAttackMob;
import net.minecraft.world.entity.projectile.SmallFireball;
import net.minecraft.server.level.ServerLevel;
`
    : ''
  const rangedMethod = mob.ai.rangedAttack
    ? `
    @Override
    public void performRangedAttack(LivingEntity target, float pullProgress) {
        if (!(this.level() instanceof ServerLevel serverLevel)) return;
        SmallFireball fireball = new SmallFireball(serverLevel, this, target.getX() - this.getX(), target.getY(0.5) - this.getY(0.5), target.getZ() - this.getZ());
        fireball.setPos(this.getX(), this.getEyeY() - 0.1, this.getZ());
        serverLevel.addFreshEntity(fireball);
    }
`
    : ''

  return `package ${pkg}.entity;

import net.minecraft.world.entity.EntityType;
import net.minecraft.world.entity.ai.attributes.AttributeSupplier;
import net.minecraft.world.entity.ai.attributes.Attributes;
import net.minecraft.world.entity.ai.goal.*;
import net.minecraft.world.entity.monster.Monster;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.level.Level;
${rangedImports}import software.bernie.geckolib.animatable.GeoEntity;
import software.bernie.geckolib.animatable.instance.AnimatableInstanceCache;
import software.bernie.geckolib.animation.*;
import software.bernie.geckolib.util.GeckoLibUtil;

public class ${mob.className} extends Monster implements GeoEntity${rangedInterface} {
    private final AnimatableInstanceCache cache = GeckoLibUtil.createInstanceCache(this);
    private boolean attacking = false;
    private boolean hurtAnim = false;
    private int hurtAnimTicks = 0;

    public ${mob.className}(EntityType<? extends Monster> type, Level world) {
        super(type, world);
    }

    public static AttributeSupplier.Builder createAttributes() {
        return Monster.createMonsterAttributes()
            .add(Attributes.MAX_HEALTH, ${mob.health})
            .add(Attributes.MOVEMENT_SPEED, ${mob.speed})
            .add(Attributes.ATTACK_DAMAGE, ${mob.damage});
    }

    @Override
    protected void registerGoals() {
${goals.join('\n')}
    }
${rangedMethod}
    @Override
    public void tick() {
        super.tick();
        if (this.swinging) attacking = true;
        else if (attacking && !this.swinging) attacking = false;
        if (hurtAnimTicks > 0) hurtAnimTicks--;
        else hurtAnim = false;
    }

    @Override
    public boolean hurt(net.minecraft.world.damagesource.DamageSource source, float amount) {
        boolean result = super.hurt(source, amount);
        if (result) {
            hurtAnim = true;
            hurtAnimTicks = 10;
        }
        return result;
    }

    public boolean isAttackingAnim() {
        return attacking;
    }

    public boolean isHurtAnim() {
        return hurtAnim;
    }

    @Override
    public void registerControllers(AnimatableManager.ControllerRegistrar controllers) {
        controllers.add(new AnimationController<>(this, "controller", 0, state -> {
            if (isHurtAnim()) return state.setAndContinue(RawAnimation.begin().thenPlay("${mob.anims.hurt}"));
            if (isAttackingAnim()) return state.setAndContinue(RawAnimation.begin().thenLoop("${mob.anims.attack}"));
            if (getDeltaMovement().horizontalDistanceSqr() > 1.0E-6) return state.setAndContinue(RawAnimation.begin().thenLoop("${mob.anims.walk}"));
            return state.setAndContinue(RawAnimation.begin().thenLoop("${mob.anims.idle}"));
        }));
    }

    @Override
    public AnimatableInstanceCache getAnimatableInstanceCache() {
        return cache;
    }
}
`
}

function generateMobModel(pkg: string, modId: string, mob: MobDef): string {
  return `package ${pkg}.client.model;

import ${pkg}.entity.${mob.className};
import net.minecraft.resources.Identifier;
import software.bernie.geckolib.model.GeoModel;

public class ${mob.className}Model extends GeoModel<${mob.className}> {
    @Override
    public Identifier getModelResource(${mob.className} animatable) {
        return Identifier.fromNamespaceAndPath("${modId}", "${mob.geo}");
    }

    @Override
    public Identifier getTextureResource(${mob.className} animatable) {
        return Identifier.fromNamespaceAndPath("${modId}", "${mob.texture}");
    }

    @Override
    public Identifier getAnimationResource(${mob.className} animatable) {
        return Identifier.fromNamespaceAndPath("${modId}", "${mob.animations}");
    }
}
`
}

function generateMobRenderer(pkg: string, mob: MobDef): string {
  return `package ${pkg}.client.renderer;

import ${pkg}.client.model.${mob.className}Model;
import ${pkg}.entity.${mob.className};
import net.minecraft.client.renderer.entity.EntityRendererProvider;
import software.bernie.geckolib.renderer.GeoEntityRenderer;

public class ${mob.className}Renderer extends GeoEntityRenderer<${mob.className}> {
    public ${mob.className}Renderer(EntityRendererProvider.Context context) {
        super(context, new ${mob.className}Model());
    }
}
`
}

function generateArmorClass(pkg: string, armor: ArmorDef): string {
  return `package ${pkg}.item;

import net.minecraft.world.item.ArmorItem;
import net.minecraft.world.item.ArmorMaterials;
import net.minecraft.world.item.Item;

public class ${armor.className} extends ArmorItem {
    public ${armor.className}(Item.Properties settings) {
        super(ArmorMaterials.IRON, ArmorItem.Type.${armor.slot}, settings);
    }
}
`
}

function generateClientMod(parsed: ParsedProject): string {
  const { pkg, meta, mobs } = parsed
  const rendererImports = mobs.map((m) => `import ${pkg}.client.renderer.${m.className}Renderer;`).join('\n')
  const entityRenderers = mobs
    .map(
      (m) =>
        `        EntityRendererRegistry.register(ModEntities.${toConstant(m.id)}, ${m.className}Renderer::new);`
    )
    .join('\n')

  return `package ${pkg}.client;

import ${pkg}.ModEntities;
import ${pkg}.ModParticles;
import ${pkg}.network.ScreenshakePayload;
import net.fabricmc.api.ClientModInitializer;
import net.fabricmc.fabric.api.client.networking.v1.ClientPlayNetworking;
import net.fabricmc.fabric.api.client.rendering.v1.EntityRendererRegistry;
${rendererImports}

public class ${toClassName(meta.modId)}ClientMod implements ClientModInitializer {
    @Override
    public void onInitializeClient() {
${entityRenderers || '        // No mob renderers'}
        ClientPlayNetworking.registerGlobalReceiver(ScreenshakePayload.TYPE, (payload, context) -> {
            context.client().execute(() -> ScreenshakeHandler.shake(payload.intensity(), payload.duration()));
        });
        ModParticles.registerClient();
    }
}
`
}

function generateModParticles(pkg: string, modId: string): string {
  return `package ${pkg};

import net.fabricmc.fabric.api.particle.v1.FabricParticleTypes;
import net.minecraft.core.Registry;
import net.minecraft.core.particles.SimpleParticleType;
import net.minecraft.core.registries.BuiltInRegistries;
import net.minecraft.resources.Identifier;

public class ModParticles {
    public static SimpleParticleType SPARK;

    public static void register() {
        SPARK = Registry.register(
            BuiltInRegistries.PARTICLE_TYPE,
            Identifier.fromNamespaceAndPath("${modId}", "spark"),
            FabricParticleTypes.simple()
        );
    }

    public static void registerClient() {}
}
`
}

function generateVisualEffects(pkg: string): string {
  return `package ${pkg};

import ${pkg}.network.VisualCodingNetworking;
import net.minecraft.core.BlockPos;
import net.minecraft.core.particles.SimpleParticleType;
import net.minecraft.server.level.ServerLevel;
import net.minecraft.server.level.ServerPlayer;
import net.minecraft.world.entity.EntityType;
import net.minecraft.world.entity.LightningBolt;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.item.Item;
import net.minecraft.world.level.Level;
import net.minecraft.world.phys.Vec3;

public final class VisualEffects {
    private VisualEffects() {}

    public static void spawnParticles(Level world, BlockPos pos, SimpleParticleType particle, int count) {
        if (!(world instanceof ServerLevel serverLevel)) return;
        serverLevel.sendParticles(
            particle,
            pos.getX() + 0.5,
            pos.getY() + 1.0,
            pos.getZ() + 0.5,
            count,
            0.2,
            0.2,
            0.2,
            0.05
        );
    }

    public static void shakeScreen(Player player, float intensity, float duration) {
        if (player instanceof ServerPlayer serverPlayer) {
            VisualCodingNetworking.sendScreenshake(serverPlayer, intensity, duration);
        }
    }

    public static void teleport(Player player, double x, double y, double z) {
        player.teleportTo(x, y, z);
    }

    public static void strikeLightning(Level world, BlockPos pos) {
        if (!(world instanceof ServerLevel serverLevel)) return;
        LightningBolt bolt = EntityType.LIGHTNING_BOLT.create(serverLevel);
        if (bolt != null) {
            bolt.moveTo(Vec3.atBottomCenterOf(pos));
            serverLevel.addFreshEntity(bolt);
        }
    }

    public static void explode(Level world, BlockPos pos, float power) {
        if (!(world instanceof ServerLevel serverLevel)) return;
        serverLevel.explode(null, pos.getX() + 0.5, pos.getY() + 0.5, pos.getZ() + 0.5, power, Level.ExplosionInteraction.TNT);
    }

    public static void knockback(Player player, float strength) {
        Vec3 look = player.getLookAngle().scale(-strength);
        player.push(look.x, 0.4, look.z);
    }

    public static void giveItem(Player player, Item item, int count) {
        player.getInventory().add(new net.minecraft.world.item.ItemStack(item, count));
    }

    public static void setClearWeather(Level world, int seconds) {
        if (world instanceof ServerLevel serverLevel) {
            serverLevel.setWeatherParameters(seconds * 20, 0, false, false);
        }
    }

    public static <T extends net.minecraft.world.entity.Entity> void summonMob(
            Level world, EntityType<T> type, BlockPos pos, int count) {
        if (!(world instanceof ServerLevel serverLevel)) return;
        for (int i = 0; i < count; i++) {
            T entity = type.create(serverLevel);
            if (entity != null) {
                entity.moveTo(pos.getX() + 0.5, pos.getY() + 1, pos.getZ() + 0.5, world.getRandom().nextFloat() * 360f, 0);
                serverLevel.addFreshEntity(entity);
            }
        }
    }
}
`
}

function generateScreenshakePayload(pkg: string, modId: string): string {
  const modClass = `${toClassName(modId)}Mod`
  return `package ${pkg}.network;

import ${pkg}.${modClass};
import net.minecraft.network.RegistryFriendlyByteBuf;
import net.minecraft.network.codec.ByteBufCodecs;
import net.minecraft.network.codec.StreamCodec;
import net.minecraft.network.protocol.common.custom.CustomPacketPayload;
import net.minecraft.resources.Identifier;

public record ScreenshakePayload(float intensity, float duration) implements CustomPacketPayload {
    public static final CustomPacketPayload.Type<ScreenshakePayload> TYPE =
        new CustomPacketPayload.Type<>(Identifier.fromNamespaceAndPath(${modClass}.MOD_ID, "screenshake"));

    public static final StreamCodec<RegistryFriendlyByteBuf, ScreenshakePayload> CODEC = StreamCodec.composite(
        ByteBufCodecs.FLOAT, ScreenshakePayload::intensity,
        ByteBufCodecs.FLOAT, ScreenshakePayload::duration,
        ScreenshakePayload::new
    );

    @Override
    public Type<? extends CustomPacketPayload> type() {
        return TYPE;
    }
}
`
}

function generateNetworking(pkg: string, modId: string): string {
  return `package ${pkg}.network;

import net.fabricmc.fabric.api.networking.v1.PayloadTypeRegistry;
import net.fabricmc.fabric.api.networking.v1.ServerPlayNetworking;
import net.minecraft.server.level.ServerPlayer;

public class VisualCodingNetworking {
    public static void registerServer() {
        PayloadTypeRegistry.clientboundPlay().register(ScreenshakePayload.TYPE, ScreenshakePayload.CODEC);
    }

    public static void sendScreenshake(ServerPlayer player, float intensity, float duration) {
        ServerPlayNetworking.send(player, new ScreenshakePayload(intensity, duration));
    }
}
`
}

function generateScreenshakeHandler(pkg: string): string {
  return `package ${pkg}.client;

import net.minecraft.client.Minecraft;

public final class ScreenshakeHandler {
    private static float intensity;
    private static float timeLeft;

    private ScreenshakeHandler() {}

    public static void shake(float power, float seconds) {
        intensity = power;
        timeLeft = seconds;
    }

    public static float getIntensity() {
        if (timeLeft <= 0) return 0;
        timeLeft -= Minecraft.getInstance().getDeltaTracker().getGameTimeDeltaPartialTick(false) / 20f;
        return Math.max(0, intensity * (timeLeft > 0 ? 1 : 0));
    }
}
`
}

function generateEmoteHandler(pkg: string): string {
  return `package ${pkg}.emote;

import net.minecraft.server.level.ServerPlayer;

public interface EmoteHandler {
    String getAnimation();
    float getDuration();
    boolean lockMovement();
    void play(ServerPlayer player);
}
`
}

function generateEmoteRegistry(pkg: string, emotes: EmoteDef[]): string {
  return `package ${pkg}.emote;

import com.mojang.brigadier.arguments.StringArgumentType;
import net.fabricmc.fabric.api.command.v2.CommandRegistrationCallback;
import net.minecraft.commands.Commands;
import net.minecraft.network.chat.Component;
import net.minecraft.server.level.ServerPlayer;

import java.util.HashMap;
import java.util.Map;

public final class EmoteRegistry {
    private static final Map<String, EmoteHandler> EMOTES = new HashMap<>();

    private EmoteRegistry() {}

    public static void register(String command, EmoteHandler handler) {
        EMOTES.put(command.toLowerCase(), handler);
    }

    public static void registerCommands() {
        CommandRegistrationCallback.EVENT.register((dispatcher, registry, env) -> {
            dispatcher.register(Commands.literal("emote")
                .then(Commands.argument("name", StringArgumentType.string())
                    .executes(ctx -> {
                        ServerPlayer player = ctx.getSource().getPlayerOrException();
                        String name = StringArgumentType.getString(ctx, "name").toLowerCase();
                        EmoteHandler emote = EMOTES.get(name);
                        if (emote == null) {
                            ctx.getSource().sendFailure(Component.literal("Unknown emote: " + name));
                            return 0;
                        }
                        emote.play(player);
                        return 1;
                    })));
        });
    }
}
`
}

function generateEmotePlayer(pkg: string, modId: string): string {
  return `package ${pkg}.emote;

import ${pkg}.network.VisualCodingNetworking;
import net.minecraft.network.chat.Component;
import net.minecraft.server.level.ServerPlayer;

public final class EmotePlayer {
    private EmotePlayer() {}

    public static void play(ServerPlayer player, EmoteHandler emote) {
        player.sendSystemMessage(Component.literal("Playing emote: " + emote.getAnimation()));
        // Animation sync hooks can be extended with GeckoLib player animations
    }
}
`
}

function generateEmoteClass(pkg: string, emote: EmoteDef): string {
  return `package ${pkg}.emote;

import net.minecraft.server.level.ServerPlayer;

public class ${toClassName(emote.id)}Emote implements EmoteHandler {
    @Override
    public String getAnimation() {
        return "${emote.animation}";
    }

    @Override
    public float getDuration() {
        return ${emote.duration}f;
    }

    @Override
    public boolean lockMovement() {
        return ${emote.lockMovement};
    }

    @Override
    public void play(ServerPlayer player) {
        EmotePlayer.play(player, this);
    }
}
`
}

function generateModCommands(pkg: string, commands: CommandDef[]): string {
  const registrations = commands
    .map((cmd) => {
      const body = cmd.actions.length ? cmd.actions.join('\n') : '                // No actions'
      return `        dispatcher.register(Commands.literal("${cmd.name}")
            .executes(ctx -> {
                ServerPlayer player = ctx.getSource().getPlayerOrException();
                Level world = player.level();
${body}
                return 1;
            }));`
    })
    .join('\n')

  return `package ${pkg};

import com.mojang.brigadier.CommandDispatcher;
import net.fabricmc.fabric.api.command.v2.CommandRegistrationCallback;
import net.minecraft.commands.CommandSourceStack;
import net.minecraft.commands.Commands;
import net.minecraft.network.chat.Component;
import net.minecraft.server.level.ServerPlayer;
import net.minecraft.sounds.SoundEvents;
import net.minecraft.sounds.SoundSource;
import net.minecraft.world.effect.MobEffectInstance;
import net.minecraft.world.effect.MobEffects;
import net.minecraft.world.level.Level;
import ${pkg}.ModEntities;
import ${pkg}.ModItems;
import ${pkg}.ModParticles;
import ${pkg}.VisualEffects;

public final class ModCommands {
    private ModCommands() {}

    public static void register() {
        CommandRegistrationCallback.EVENT.register(ModCommands::registerCommands);
    }

    private static void registerCommands(CommandDispatcher<CommandSourceStack> dispatcher, net.minecraft.commands.CommandBuildContext registry, net.minecraft.commands.Commands.CommandSelection env) {
${registrations}
    }
}
`
}

function generateModEvents(pkg: string, globalEvents: GlobalEventDef[], blocks: BlockDef[]): string {
  const handlers: string[] = []

  for (const event of globalEvents) {
    const body = event.actions.length ? event.actions.join('\n') : '            // No actions'
    if (event.type === 'player_join') {
      handlers.push(`        ServerPlayConnectionEvents.JOIN.register((handler, sender, server) -> {
            ServerPlayer player = handler.getPlayer();
            Level world = player.level();
${body}
        });`)
    }
    if (event.type === 'player_death') {
      handlers.push(`        ServerLivingEntityEvents.AFTER_DEATH.register((entity, damageSource) -> {
            if (entity instanceof ServerPlayer player) {
                Level world = player.level();
${body}
            }
        });`)
    }
    if (event.type === 'player_respawn') {
      handlers.push(`        ServerPlayerEvents.AFTER_RESPAWN.register((oldPlayer, newPlayer, alive) -> {
            ServerPlayer player = newPlayer;
            Level world = player.level();
${body}
        });`)
    }
    if (event.type === 'server_tick') {
      handlers.push(`        ServerTickEvents.END_SERVER_TICK.register(server -> {
            Level world = server.overworld();
            for (ServerPlayer player : server.getPlayerList().getPlayers()) {
${body}
            }
        });`)
    }
  }

  for (const block of blocks) {
    if (block.breakActions.length === 0) continue
    handlers.push(`        PlayerBlockBreakEvents.AFTER.register((world, player, pos, state, blockEntity) -> {
            if (state.is(ModBlocks.${toConstant(block.id)})) {
${block.breakActions.join('\n')}
            }
        });`)
  }

  const body = handlers.length ? handlers.join('\n\n') : '        // No global events'

  return `package ${pkg};

import net.fabricmc.fabric.api.entity.event.v1.ServerLivingEntityEvents;
import net.fabricmc.fabric.api.entity.event.v1.ServerPlayerEvents;
import net.fabricmc.fabric.api.event.lifecycle.v1.ServerTickEvents;
import net.fabricmc.fabric.api.event.player.PlayerBlockBreakEvents;
import net.fabricmc.fabric.api.networking.v1.ServerPlayConnectionEvents;
import net.minecraft.network.chat.Component;
import net.minecraft.server.level.ServerPlayer;
import net.minecraft.sounds.SoundEvents;
import net.minecraft.sounds.SoundSource;
import net.minecraft.world.effect.MobEffectInstance;
import net.minecraft.world.effect.MobEffects;
import net.minecraft.world.level.Level;
import ${pkg}.ModBlocks;
import ${pkg}.ModEntities;
import ${pkg}.ModItems;
import ${pkg}.ModParticles;
import ${pkg}.VisualEffects;

public final class ModEvents {
    private ModEvents() {}

    public static void register() {
${body}
    }
}
`
}

function generateItemModel(modId: string, item: { id: string; texture: string }): string {
  const texId = item.texture.replace(/^textures\//, '').replace(/\.png$/, '')
  return JSON.stringify(
    { parent: 'minecraft:item/generated', textures: { layer0: `${modId}:${texId}` } },
    null,
    2
  )
}

function generateBlockstate(modId: string, block: BlockDef): string {
  return JSON.stringify({ variants: { '': { model: `${modId}:block/${block.id}` } } }, null, 2)
}

function generateBlockModel(modId: string, block: BlockDef): string {
  const texId = block.texture.replace(/^textures\//, '').replace(/\.png$/, '')
  return JSON.stringify(
    { parent: 'minecraft:block/cube_all', textures: { all: `${modId}:${texId}` } },
    null,
    2
  )
}

function generateBlockItemModel(modId: string, block: BlockDef): string {
  return JSON.stringify({ parent: `${modId}:block/${block.id}` }, null, 2)
}
