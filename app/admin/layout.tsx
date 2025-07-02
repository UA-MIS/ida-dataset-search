import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdminSidebar from "../components/AdminSidebar";
import Modal from "../components/Modal";
import AddUserForm from "../components/AddUserForm";
import { SignOutButton } from "@clerk/nextjs";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
          <div className="flex flex-col h-full">
            <div className="p-6">
              <h1 className="text-xl font-bold text-red-800">IDA Admin</h1>
            </div>
            <AdminSidebar />
            <div className="mt-auto p-4 border-t border-gray-200 flex justify-center">
              <SignOutButton redirectUrl="/">
                <button className="w-full text-center px-4 py-2 bg-red-50 text-red-800 font-semibold rounded-md hover:bg-red-100 transition-colors">
                  Sign out
                </button>
              </SignOutButton>
            </div>
          </div>
        </div>

        <div className="pl-64">
          <main className="p-8">{children}</main>
        </div>
      </div>
      <Modal id="add-user-modal" header="Add New User" body={<AddUserForm />} />
    </>
  );
}
