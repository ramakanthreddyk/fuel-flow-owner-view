
import { useUser } from "@/context/UserContext";
import { InfoCard } from "@/components/dashboard/InfoCard";
import { Building, Fuel, ShoppingCart, FileEdit, Settings, CircleDollarSign } from "lucide-react";
import RequirePlan from "@/components/RequirePlan";

export default function DashboardPage() {
  const { user, loading, error } = useUser();

  if (loading) {
    return <div className="p-8 text-gray-600">Loading...</div>;
  }
  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>;
  }
  if (!user) {
    return <div className="p-8 text-gray-600">No user data found.</div>;
  }

  // Only show these cards for owners or higher
  const showOwnerCards = user.role === "owner" || user.role === "superadmin";
  // Only show for superadmin
  const showSuperadminCards = user.role === "superadmin";
  // Only for employee
  const showEmployeeCards = user.role === "employee";

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome, {user.name}
        </h1>
        <div className="text-sm text-gray-600 font-medium">
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)} {user.plan === "premium" && <>· <span className="text-yellow-600">Premium</span></>}
        </div>
      </div>

      {/* Premium banner */}
      {user.plan !== "premium" && (
        <div className="mb-7 rounded-xl border-2 border-yellow-300 bg-yellow-50/90 px-6 py-4 flex items-center gap-5 shadow-inner">
          <CircleDollarSign className="text-yellow-700 w-7 h-7" />
          <div className="flex-1">
            <span className="font-semibold text-yellow-800">Unlock advanced analytics, exports, and insights with Premium!</span>
          </div>
          <a href="/settings" className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded font-semibold shadow transition">
            Upgrade Now
          </a>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">

        {/* Only show stations, sales, data entry to owners or superadmins */}
        {showOwnerCards && (
          <>
            {/* Stations Card */}
            <InfoCard
              icon={<Building className="w-8 h-8" />}
              title="Manage your Stations"
              description="View and edit your fuel stations."
              cta={
                <a href="/stations" className="text-blue-600 underline font-medium">Go to Stations</a>
              }
            />

            {/* Sales Card */}
            <InfoCard
              icon={<ShoppingCart className="w-8 h-8" />}
              title="Sales Analytics"
              description="Analyze sales and transaction data."
              cta={
                <a href="/sales" className="text-blue-600 underline font-medium">See Sales</a>
              }
            />

            {/* Data Entry Card */}
            <InfoCard
              icon={<FileEdit className="w-8 h-8" />}
              title="Enter Data"
              description="Fill in daily sales, dispensing, and refills."
              cta={
                <a href="/data-entry" className="text-blue-600 underline font-medium">Data Entry</a>
              }
            />
          </>
        )}

        {/* Only superadmin: User Management */}
        {showSuperadminCards && (
          <InfoCard
            icon={<Building className="w-8 h-8" />}
            title="User Management"
            description="Add, remove, and manage users for your account."
            cta={
              <a href="/users" className="text-blue-600 underline font-medium">Go to Users</a>
            }
          />
        )}

        {/* Premium Analytics Card: Only if superadmin/owner has premium */}
        <RequirePlan plans={["premium"]} fallback={
          (showOwnerCards || showSuperadminCards) && (
            <InfoCard
              icon={<Fuel className="w-8 h-8" />}
              title="Premium Analytics"
              description="Access advanced visualizations and trends."
              cta={
                <a href="/settings" className="text-yellow-600 underline font-medium">Upgrade to Premium</a>
              }
              premium
              locked
              lockHint="Available on Premium plan only"
              blur
            />
          )
        }>
          {(showOwnerCards || showSuperadminCards) && (
            <InfoCard
              icon={<Fuel className="w-8 h-8" />}
              title="Premium Analytics"
              description="Access advanced visualizations and trends."
              cta={
                <a href="/dashboard" className="text-blue-600 underline font-medium">View Premium Analytics</a>
              }
              premium
            />
          )}
        </RequirePlan>

        {/* Settings - always available */}
        <InfoCard
          icon={<Settings className="w-8 h-8" />}
          title="Settings"
          description="Edit your profile, plan, and account settings."
          cta={
            <a href="/settings" className="text-blue-600 underline font-medium">Account Settings</a>
          }
        />

      </div>
    </div>
  );
}

