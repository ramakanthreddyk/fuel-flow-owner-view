
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOwnerStations } from "@/hooks/useManualEntryData";
import { useUser } from "@/context/UserContext";

// StationSelector props: value, onChange
export default function StationSelector({
  value, onChange
}: { value?: string; onChange: (id: string) => void; }) {
  const { user } = useUser();
  const { data: stations = [], isLoading, error } = useOwnerStations(user?.id);

  if (isLoading) return <div>Loading stations...</div>;
  if (error) return <div>Error loading stations</div>;

  return (
    <Select value={value} onValueChange={onChange} required>
      <SelectTrigger>
        <SelectValue placeholder="Select Station" />
      </SelectTrigger>
      <SelectContent>
        {stations.map((st: any) => (
          <SelectItem key={st.id} value={st.id}>{st.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
