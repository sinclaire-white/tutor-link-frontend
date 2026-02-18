"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/axios";
import { StatSkeleton } from "@/components/ui/skeletons/CardSkeleton";
import { Users, GraduationCap, Calendar, Star } from "lucide-react";

interface StatsData {
  totalUsers: number;
  totalTutors: number;
  totalBookings: number;
  completedBookings: number;
}

const statIcons = {
  users: Users,
  tutors: GraduationCap,
  bookings: Calendar,
  rating: Star,
};

export function Stats() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/admin/stats");
        setStats(data.data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        // Fallback to default stats if API fails
        setStats({
          totalUsers: 0,
          totalTutors: 0,
          totalBookings: 0,
          completedBookings: 0,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const displayStats = stats
    ? [
        {
          value: `${stats.totalUsers}+`,
          label: "Active Students",
          icon: statIcons.users,
        },
        {
          value: `${stats.totalTutors}+`,
          label: "Verified Tutors",
          icon: statIcons.tutors,
        },
        {
          value: `${stats.completedBookings}+`,
          label: "Sessions Completed",
          icon: statIcons.bookings,
        },
        {
          value: "4.9/5",
          label: "Average Rating",
          icon: statIcons.rating,
        },
      ]
    : [];

  return (
    <section className="bg-primary text-primary-foreground w-full py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <StatSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {displayStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center group">
                  <div className="mb-3 inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-foreground/10 group-hover:bg-primary-foreground/20 transition-colors">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">
                    {stat.value}
                  </div>
                  <p className="text-primary-foreground/80 text-base md:text-lg">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}