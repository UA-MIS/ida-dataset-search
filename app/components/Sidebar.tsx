import React from "react";

interface Props {
  pageChildren: React.ReactNode;
  sidebarChildren: React.ReactNode;
  title: string;
  id: string;
}

const Sidebar = ({ pageChildren, sidebarChildren, title, id }: Props) => {
  return (
    <>
      <div className="drawer">
        <input id={id} type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">{pageChildren}</div>
        <div className="drawer-side">
          <label
            htmlFor={id}
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <div className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
            <h1 className="text-xl font-bold text-red-800">{title}</h1>
            {sidebarChildren}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
