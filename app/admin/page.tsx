"use client";
import StatCard from "../components/StatCard";
import ActivityItem from "../components/ActivityItem";
import LoadingMessage from "../components/LoadingMessage";
import { useFetchAdminOverview } from "../hooks/useFetchAdminOverview";

export default function AdminDashboard() {
  const { overview, isLoading } = useFetchAdminOverview();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingMessage message="Loading admin page..." />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-row gap-4">
          <StatCard
            title="Total Datasets"
            value={overview?.datasets?.toString() || "0"}
            className="w-1/6"
          />
          <StatCard
            title="Active Datasets"
            value={overview?.active_datasets?.toString() || "0"}
            className="w-1/6"
          />
          <StatCard
            title="Downloads"
            value={overview?.total_downloads?.toString() || "0"}
            className="w-1/6"
          />
          <StatCard
            title="Users"
            value={overview?.users?.toString() || "0"}
            className="w-1/6"
          />
          <StatCard
            title="Tags"
            value={overview?.tags?.toString() || "0"}
            className="w-1/6"
          />
          <StatCard
            title="Categories"
            value={overview?.categories?.toString() || "0"}
            className="w-1/6"
          />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Recent Activity</h2>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                All
              </button>
              <button className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                Downloads
              </button>
              <button className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                Datasets
              </button>
              <button className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                Users
              </button>
            </div>
          </div>
          <div className="space-y-4">
            <ActivityItem
              message='New dataset "Electric Vehicle Data" added'
              timestamp="2 hours ago"
              color="green"
            />
            <ActivityItem
              message='User "John Doe" logged in'
              timestamp="3 hours ago"
              color="blue"
            />
            <ActivityItem
              message='Dataset "Test Alpha" updated'
              timestamp="5 hours ago"
              color="yellow"
            />
          </div>
        </div>
      </div>
    </>
  );
}
