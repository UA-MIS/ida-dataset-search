import { redirect } from "next/navigation";
import AdminSidebar from "../components/AdminSidebar";
import Modal from "../components/Modal";
import AddUserForm from "../components/AddUserForm";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth disabled for now — allow all access
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
          <div className="flex flex-col h-full">
            <div className="p-6">
              <h1 className="text-xl font-bold text-red-800">IDA Admin</h1>
            </div>
            <AdminSidebar />
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
