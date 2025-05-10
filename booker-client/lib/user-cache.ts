import { LRUCache } from "lru-cache";
import { createClient } from "@/utils/supabase/server";
import { User } from "@/app/types";

// Cache user profiles for 5 minutes
const userCache = new LRUCache<string, any>({
    max: 500, // Max number of users to cache
    ttl: 1000 * 60 * 5, // 5 minutes
});

export async function getUserProfile(
    userId: string | undefined | null,
): Promise<User | null> {
    if (!userId) return null;

    const cached = userCache.get(userId);

    if (cached) return cached;

    // If not in cache, fetch from database
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", userId)
        .single();

    if (data && !error) {
        userCache.set(userId, data);
        return data;
    }

    return null;
}
