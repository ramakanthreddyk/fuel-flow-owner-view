
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { ChevronDown } from "lucide-react";

// Dummy mock: station → pumps → nozzles
const station = {
  name: "Fuel Point Express, Main Rd",
  pumps: [
    {
      name: "Pump 1",
      nozzles: [
        { name: "Nozzle 1A", fuelType: "Petrol" },
        { name: "Nozzle 1B", fuelType: "Diesel" },
      ]
    },
    {
      name: "Pump 2",
      nozzles: [
        { name: "Nozzle 2A", fuelType: "Petrol" },
        { name: "Nozzle 2B", fuelType: "Diesel" },
      ]
    },
    {
      name: "Pump 3",
      nozzles: [
        { name: "Nozzle 3A", fuelType: "Diesel" }
      ]
    }
  ]
};

const fuelColor = (type: string) =>
  type === "Petrol" ? "text-green-600" : "text-blue-600";

const StationHierarchy = () => {
  return (
    <Accordion type="single" className="w-full" collapsible>
      <AccordionItem value="station-main">
        <AccordionTrigger className="font-medium text-base">
          {station.name}
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col gap-3">
            {station.pumps.map((pump, idx) => (
              <Accordion type="single" key={pump.name} collapsible>
                <AccordionItem value={`pump-${idx}`}>
                  <AccordionTrigger className="pl-4 text-base flex items-center">
                    <ChevronDown className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="font-semibold">{pump.name}</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="ml-8 mt-2 flex flex-col gap-2">
                      {pump.nozzles.map((nozzle) => (
                        <div
                          key={nozzle.name}
                          className="flex items-center gap-2 px-3 py-1 rounded hover:bg-muted"
                        >
                          <span className="font-medium">{nozzle.name}</span>
                          <span
                            className={`text-xs ${fuelColor(nozzle.fuelType)} font-semibold bg-muted px-2 py-0.5 rounded`}
                          >
                            {nozzle.fuelType}
                          </span>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default StationHierarchy;
