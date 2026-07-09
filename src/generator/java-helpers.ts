export function generateVisualCodingActions(pkg: string): string {
  return `package ${pkg};

import net.minecraft.core.BlockPos;
import net.minecraft.core.registries.BuiltInRegistries;
import net.minecraft.network.chat.Component;
import net.minecraft.resources.Identifier;
import net.minecraft.server.level.ServerLevel;
import net.minecraft.server.level.ServerPlayer;
import net.minecraft.world.Difficulty;
import net.minecraft.world.entity.Entity;
import net.minecraft.world.entity.EntitySpawnReason;
import net.minecraft.world.entity.EntityType;
import net.minecraft.world.entity.LivingEntity;
import net.minecraft.world.entity.Mob;
import net.minecraft.world.entity.item.ItemEntity;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.entity.projectile.Arrow;
import net.minecraft.world.entity.projectile.LargeFireball;
import net.minecraft.world.item.Item;
import net.minecraft.world.item.ItemStack;
import net.minecraft.world.item.Items;
import net.minecraft.world.level.GameType;
import net.minecraft.world.level.Level;
import net.minecraft.world.level.block.Block;
import net.minecraft.world.level.block.Blocks;
import net.minecraft.world.level.storage.ServerLevelData;
import net.minecraft.world.phys.AABB;
import net.minecraft.world.phys.Vec3;
import ${pkg}.ModItems;

import java.util.List;
import java.util.function.Consumer;

public final class VisualCodingActions {
    private VisualCodingActions() {}

    public static void strikeLightning(ServerLevel level, BlockPos pos) {
        runAt(level, pos, "summon lightning_bolt ~ ~ ~");
    }

    public static void setClearWeather(ServerLevel level, int seconds) {
        runAt(level, BlockPos.ZERO, "weather clear " + Math.max(1, seconds));
    }

    public static void startRain(ServerLevel level, int seconds) {
        runAt(level, BlockPos.ZERO, "weather rain " + Math.max(1, seconds));
    }

    public static void startThunder(ServerLevel level, int seconds) {
        runAt(level, BlockPos.ZERO, "weather thunder " + Math.max(1, seconds));
    }

    public static <T extends Entity> void summonEntity(ServerLevel level, EntityType<T> type, BlockPos pos, int count) {
        for (int i = 0; i < count; i++) {
            BlockPos spawn = pos.offset(level.random.nextInt(5) - 2, 1, level.random.nextInt(5) - 2);
            type.spawn(level, spawn, EntitySpawnReason.COMMAND);
        }
    }

    public static void summonVanillaMob(ServerLevel level, String mob, BlockPos pos, int count) {
        String path = switch (mob) {
            case "ZOMBIE" -> "zombie";
            case "SKELETON" -> "skeleton";
            case "CREEPER" -> "creeper";
            case "SPIDER" -> "spider";
            case "ENDERMAN" -> "enderman";
            case "WITCH" -> "witch";
            case "BLAZE" -> "blaze";
            case "SLIME" -> "slime";
            case "VILLAGER" -> "villager";
            case "IRON_GOLEM" -> "iron_golem";
            case "WOLF" -> "wolf";
            case "CAT" -> "cat";
            case "BEE" -> "bee";
            case "PHANTOM" -> "phantom";
            case "WARDEN" -> "warden";
            default -> "zombie";
        };
        EntityType<?> type = BuiltInRegistries.ENTITY_TYPE.getValue(Identifier.fromNamespaceAndPath("minecraft", path));
        if (type == null) return;
        for (int i = 0; i < count; i++) {
            BlockPos spawn = pos.offset(level.random.nextInt(5) - 2, 1, level.random.nextInt(5) - 2);
            type.spawn(level, spawn, EntitySpawnReason.COMMAND);
        }
    }

    public static void killNearbyMobs(ServerLevel level, Player player, double range) {
        AABB box = player.getBoundingBox().inflate(range);
        List<Mob> mobs = level.getEntitiesOfClass(Mob.class, box, e -> e != player);
        for (Mob mob : mobs) mob.discard();
    }

    public static void setGamemode(ServerPlayer player, String mode) {
        GameType type = switch (mode) {
            case "CREATIVE" -> GameType.CREATIVE;
            case "ADVENTURE" -> GameType.ADVENTURE;
            case "SPECTATOR" -> GameType.SPECTATOR;
            default -> GameType.SURVIVAL;
        };
        player.setGameMode(type);
    }

    public static void setDifficulty(ServerLevel level, String difficulty) {
        Difficulty value = switch (difficulty) {
            case "PEACEFUL" -> Difficulty.PEACEFUL;
            case "EASY" -> Difficulty.EASY;
            case "HARD" -> Difficulty.HARD;
            default -> Difficulty.NORMAL;
        };
        level.getServer().setDifficulty(value, true);
    }

    public static void setTime(ServerLevel level, long time) {
        level.setDayTime(time);
    }

    public static void actionBar(ServerPlayer player, String message) {
        player.displayClientMessage(Component.literal(message), true);
    }

    public static void giveBlockItem(Player player, String blockKey, int count) {
        Item item = switch (blockKey) {
            case "DIRT" -> Items.DIRT;
            case "GRASS_BLOCK" -> Items.GRASS_BLOCK;
            case "TNT" -> Items.TNT;
            case "OBSIDIAN" -> Items.OBSIDIAN;
            case "GLASS" -> Items.GLASS;
            case "DIAMOND_BLOCK" -> Items.DIAMOND_BLOCK;
            case "GOLD_BLOCK" -> Items.GOLD_BLOCK;
            case "ICE" -> Items.ICE;
            case "TORCH" -> Items.TORCH;
            case "CHEST" -> Items.CHEST;
            default -> Items.STONE;
        };
        player.getInventory().add(new ItemStack(item, count));
    }

    public static void removeItem(Player player, Item item, int count) {
        int remaining = count;
        for (int i = 0; i < player.getInventory().getContainerSize() && remaining > 0; i++) {
            ItemStack stack = player.getInventory().getItem(i);
            if (stack.is(item)) {
                int remove = Math.min(stack.getCount(), remaining);
                stack.shrink(remove);
                remaining -= remove;
            }
        }
    }

    public static void dropItem(ServerLevel level, Player player, Item item, int count) {
        ItemEntity entity = new ItemEntity(level, player.getX(), player.getY(), player.getZ(), new ItemStack(item, count));
        level.addFreshEntity(entity);
    }

    public static Block resolveBlock(String blockKey) {
        return switch (blockKey) {
            case "DIRT" -> Blocks.DIRT;
            case "GRASS_BLOCK" -> Blocks.GRASS_BLOCK;
            case "TNT" -> Blocks.TNT;
            case "OBSIDIAN" -> Blocks.OBSIDIAN;
            case "GLASS" -> Blocks.GLASS;
            case "DIAMOND_BLOCK" -> Blocks.DIAMOND_BLOCK;
            case "GOLD_BLOCK" -> Blocks.GOLD_BLOCK;
            case "ICE" -> Blocks.ICE;
            case "TORCH" -> Blocks.TORCH;
            case "CHEST" -> Blocks.CHEST;
            default -> Blocks.STONE;
        };
    }

    public static void placeBlock(ServerLevel level, BlockPos pos, String blockKey) {
        level.setBlockAndUpdate(pos, resolveBlock(blockKey).defaultBlockState());
    }

    public static void breakBlock(ServerLevel level, BlockPos pos) {
        level.destroyBlock(pos, true);
    }

    public static void shootArrow(ServerLevel level, Player player, float power) {
        Arrow arrow = new Arrow(level, player, new ItemStack(Items.ARROW), player.getUsedItemHand());
        arrow.shootFromRotation(player, player.getXRot(), player.getYRot(), 0.0f, power, 1.0f);
        level.addFreshEntity(arrow);
    }

    public static void shootFireball(ServerLevel level, Player player) {
        Vec3 look = player.getLookAngle();
        LargeFireball fireball = new LargeFireball(level, player, look.scale(0.1), 1);
        fireball.setPos(player.getX(), player.getEyeY() - 0.1, player.getZ());
        level.addFreshEntity(fireball);
    }

    public static void launchEntity(LivingEntity entity, float strength) {
        Vec3 look = entity.getLookAngle().scale(strength);
        entity.push(look.x, 0.5, look.z);
    }

    public static boolean hasItem(Player player, Item item) {
        return player.getInventory().contains(new ItemStack(item));
    }

    public static boolean isDimension(Player player, String dimension) {
        Identifier id = player.level().dimension().identifier();
        return switch (dimension) {
            case "NETHER" -> id.equals(Identifier.fromNamespaceAndPath("minecraft", "the_nether"));
            case "END" -> id.equals(Identifier.fromNamespaceAndPath("minecraft", "the_end"));
            default -> id.equals(Identifier.fromNamespaceAndPath("minecraft", "overworld"));
        };
    }

    public static void schedule(ServerLevel level, int ticks, Runnable task) {
        ModScheduler.schedule(level, ticks, task);
    }

    private static void runAt(ServerLevel level, BlockPos pos, String command) {
        var source = level.getServer().createCommandSourceStack()
            .withLevel(level)
            .withPosition(Vec3.atCenterOf(pos))
            .withPermission(2);
        level.getServer().getCommands().performPrefixedCommand(source, command);
    }
}
`
}

export function generateModScheduler(pkg: string): string {
  return `package ${pkg};

import net.minecraft.server.level.ServerLevel;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public final class ModScheduler {
    private static final List<ScheduledTask> TASKS = new ArrayList<>();

    private ModScheduler() {}

    public static void schedule(ServerLevel level, int ticks, Runnable task) {
        TASKS.add(new ScheduledTask(level, ticks, task));
    }

    public static void tick(ServerLevel level) {
        Iterator<ScheduledTask> it = TASKS.iterator();
        while (it.hasNext()) {
            ScheduledTask task = it.next();
            if (task.level != level) continue;
            task.ticks--;
            if (task.ticks <= 0) {
                task.task.run();
                it.remove();
            }
        }
    }

    private record ScheduledTask(ServerLevel level, int ticks, Runnable task) {}
}
`
}
