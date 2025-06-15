
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Helper to fetch stations per role
function useStationsForUser(user: any) {
  return useQuery({
    queryKey: ["tender-entry-stations", user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!user) return [];
      // Owner: stations.created_by = user.id
      if (user.role === "owner" || user.role === "superadmin") {
        const { data, error } = await supabase
          .from("stations")
          .select("id, name, address")
          .eq("created_by", user.id);
        if (error) throw error;
        return data || [];
      }
      // Employee: join employee_station_assignments
      if (user.role === "employee") {
        const { data, error } = await supabase
          .from("employee_station_assignments")
          .select("station_id")
          .eq("user_id", user.id);
        if (error) throw error;
        if (!data?.length) return [];
        // Just fetch the one station (employees have one station assigned)
        const stationIds = data.map(item => item.station_id);
        const { data: stations, error: sErr } = await supabase
          .from("stations")
          .select("id, name, address")
          .in("id", stationIds);
        if (sErr) throw sErr;
        return stations || [];
      }
      return [];
    }
  });
}

type TenderEntryFormInputs = {
  stationId: string;
  amount: string;
  notes: string;
};

export default function TenderEntryForm() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const { data: stations = [], isLoading: loadingStations, error: stationError } = useStationsForUser(user);

  // If user is employee and has one assigned station, pre-select and lock.
  const employeeMode = user?.role === "employee";
  const singleStation = employeeMode && stations.length === 1;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<TenderEntryFormInputs>({
    defaultValues: {
      stationId: singleStation ? stations[0]?.id : "",
      amount: "",
      notes: ""
    }
  });

  // Watch stationId to auto-select for single-station employee
  if (singleStation && !watch("stationId")) {
    setValue("stationId", stations[0]?.id, { shouldValidate: true });
  }

  // Save entry
  const onSubmit = async (values: TenderEntryFormInputs) => {
    if (!user || !values.stationId || !values.amount) {
      toast({ title: "Error", description: "Missing required fields.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const payload = {
      station_id: values.stationId,
      user_id: user.id,
      amount: Number(values.amount),
      notes: values.notes || null,
    };
    const { error } = await supabase.from("tender_entries").insert([payload]);
    setSubmitting(false);
    if (error) {
      toast({ title: "Error", description: error?.message, variant: "destructive" });
      return;
    }
    toast({ title: "Success!", description: "Tender entry submitted." });
    // Optionally, you could reset or refetch
    setValue("amount", "");
    setValue("notes", "");
    queryClient.invalidateQueries({ queryKey: ["tender_entries"] });
  };

  return (
    <form className="space-y-5 max-w-md mx-auto" onSubmit={handleSubmit(onSubmit)}>
      {loadingStations && <div className="text-center text-muted-foreground">Loading stations...</div>}
      {stationError && <div className="text-red-500">Failed to load stations</div>}

      {/* Station selector */}
      <div>
        <label className="block mb-1 font-medium">Station <span className="text-red-500">*</span></label>
        <Select
          value={watch("stationId")}
          onValueChange={val => setValue("stationId", val, { shouldValidate: true })}
          required
          disabled={employeeMode}
        >
          <SelectTrigger>
            <SelectValue placeholder={loadingStations ? "Loading..." : "Select Station"} />
          </SelectTrigger>
          <SelectContent>
            {stations.map((st: any) => (
              <SelectItem key={st.id} value={st.id}>
                {st.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.stationId && <div className="text-destructive text-xs mt-1">{errors.stationId.message}</div>}
      </div>
      {/* Amount */}
      <div>
        <label className="block mb-1 font-medium">Amount <span className="text-red-500">*</span></label>
        <Input
          type="number"
          min={0.01}
          step="0.01"
          {...register("amount", {
            required: "Amount required",
            min: { value: 0.01, message: "Amount must be positive" }
          })}
          disabled={submitting}
        />
        {errors.amount && <div className="text-destructive text-xs mt-1">{errors.amount.message}</div>}
      </div>
      {/* Notes */}
      <div>
        <label className="block mb-1 font-medium">Notes <span className="text-gray-400 text-xs">(optional)</span></label>
        <Textarea {...register("notes")} placeholder="Notes" disabled={submitting} />
      </div>
      {/* Submit button */}
      <Button type="submit" className="w-full" disabled={submitting || !watch("stationId") || !watch("amount") || Number(watch("amount")) < 0.01}>
        {submitting ? "Submitting..." : "Submit Tender Entry"}
      </Button>
    </form>
  );
}
