"use client";
import StatCard from "../components/StatCard";
import ActivityItem from "../components/ActivityItem";
import { categories } from "../constants";
import { useFetchDatasets } from "../hooks/useFetchDatasets";
import { useFetchTags } from "../hooks/useFetchTags";
import { useFetchUsers } from "../hooks/useFetchUsers";

export default function AdminDashboard() {
  const { datasets, isLoading } = useFetchDatasets();
  const { tags, isLoading: tagsLoading } = useFetchTags();
  const { users, isLoading: usersLoading } = useFetchUsers();

  return (
    <>
      <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Total Datasets" value={datasets.length} />
              <StatCard title="Active Users" value={users.length} />
              <StatCard title="Total Tags" value={tags.length} />
              <StatCard title="Categories" value={categories.length} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Recent Activity</h2>
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                    All
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


