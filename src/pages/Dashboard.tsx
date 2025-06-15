
import { useUser } from "@/context/UserContext";
import { Building, Settings } from "lucide-react";
import { useDashboardData } from "@/hooks/useDashboardData";

export default function DashboardPage() {
  const { user, loading: userLoading, error: userError } = useUser();
  const { stations, loading, error } = useDashboardData();

  if (userLoading || loading) {
    return <div className="p-8 text-gray-600">Loading...</div>;
  }
  if (userError || error) {
    return <div className="p-8 text-red-500">Error: {userError || error}</div>;
  }
  if (!user) {
    return <div className="p-8 text-gray-600">No user data found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome, {user.name}
        </h1>
        <div className="text-sm text-gray-600 font-medium">
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          {user.plan === "premium" && (
            <>
              {" "}
              · <span className="text-yellow-600">Premium</span>
            </>
          )}
        </div>
      </div>

      {stations.length === 0 ? (
        <div className="my-10 text-center text-gray-500">
          No stations found for this account.
        </div>
      ) : (
        stations.map((station) => (
          <div
            key={station.id}
            className="mb-10 p-6 border border-gray-200 bg-white rounded-lg shadow-sm"
          >
            <div className="flex items-center mb-4 gap-3">
              <Building className="w-7 h-7 text-blue-600" />
              <div>
                <div className="font-semibold text-lg">{station.name}</div>
                <div className="text-xs text-gray-500">
                  {station.address} {station.city && <>· {station.city}</>}
                </div>
              </div>
            </div>
            <div className="ml-4">
              {station.pumps.length === 0 ? (
                <div className="text-gray-400 mb-2">No pumps found in this station.</div>
              ) : (
                station.pumps.map((pump) => (
                  <div key={pump.id} className="mb-6">
                    <div className="font-medium text-base mb-2">
                      {pump.label}
                    </div>
                    {pump.nozzles.length === 0 ? (
                      <div className="text-gray-400 ml-6">No nozzles for this pump.</div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ml-6">
                        {pump.nozzles.map((nozzle) => (
                          <div
                            key={nozzle.id}
                            className="border p-3 rounded-md bg-gray-50 flex flex-col"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">
                                {nozzle.label}
                              </span>
                              <span className={`px-2 py-0.5 text-xs rounded font-medium ${nozzle.fuel_type === "petrol"
                                ? "bg-green-100 text-green-700"
                                : "bg-blue-100 text-blue-700"
                                }`}>
                                {nozzle.fuel_type}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 mb-1">
                              Nozzle ID: <span className="font-mono">{nozzle.id.slice(-6)}</span>
                            </div>
                            <div>
                              <span className="mr-2">Latest reading:</span>
                              <span className="font-semibold text-base">{typeof nozzle.latestReading === "number" ? nozzle.latestReading : "—"}</span>
                              <span className="ml-1 text-gray-500 text-xs">
                                {nozzle.latestAt ? new Date(nozzle.latestAt).toLocaleDateString() : ""}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        ))
      )}

      <div className="mt-10">
        <a
          href="/settings"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-5 py-2 rounded shadow transition"
        >
          <Settings className="w-5 h-5" />
          Account Settings
        </a>
      </div>
    </div>
  );
}
