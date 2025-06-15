
import { Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const UpgradeCard = () => (
  <Card className="border-2 border-dashed border-yellow-400 bg-yellow-50/60">
    <CardContent className="flex gap-5 items-center py-7 px-4">
      <div className="bg-yellow-100 rounded-xl p-3 flex items-center justify-center">
        <Lock className="w-8 h-8 text-yellow-600" />
      </div>
      <div className="flex-1">
        <div className="font-semibold text-lg">Unlock export, analytics, and premium insights</div>
        <div className="text-yellow-800 mt-1 text-sm">Upgrade to premium for data exports, trends, and in-depth analytics tailored to your station.</div>
      </div>
      <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-md font-semibold shadow transition">
        Upgrade Now
      </button>
    </CardContent>
  </Card>
);

export default UpgradeCard;
