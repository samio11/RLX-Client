import { AdminAnalysis } from "@/services/analysis";
import { getUserByToken } from "@/services/user";

import { Badge } from "@/components/ui/badge";
import EditProfileModal from "./_EditComp";
import { Info, Stat } from "./_ReUseComp";

export default async function AdminDashboard() {
  const analysisRes = await AdminAnalysis();
  const userRes = await getUserByToken();

  const stats = analysisRes?.data;
  const user = userRes?.data;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        <Stat title="Total Admin" value={stats.totalAdmin} />
        <Stat title="Total User" value={stats.totalUser} />
        <Stat title="Blocked User" value={stats.totalBlockedUser} />
      </div>

      <div className="border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">Admin Information</h2>

        <Info label="Name" value={user.name} />
        <Info label="Email" value={user.email} />
        <Info label="Phone" value={user.phone} />
        <Info label="Address" value={user.address} />

        <div className="flex gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Role</p>
            <Badge variant="secondary">{user.role}</Badge>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Verified</p>
            <Badge variant={user.isVerified ? "default" : "destructive"}>
              {user.isVerified ? "Yes" : "No"}
            </Badge>
          </div>
        </div>

        <Info
          label="Created At"
          value={new Date(user.createdAt).toLocaleString()}
        />
        <Info
          label="Updated At"
          value={new Date(user.updatedAt).toLocaleString()}
        />

        {/* Edit Button  */}
        <EditProfileModal user={user} />
      </div>
    </div>
  );
}
