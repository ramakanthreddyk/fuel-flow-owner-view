
export default function SalePreview({
  previousReading,
  currentReading,
  fuelPrice,
}: {
  previousReading: number;
  currentReading: number;
  fuelPrice: number;
}) {
  if (!previousReading || !currentReading || !fuelPrice) return null;
  const delta = currentReading - previousReading;
  if (isNaN(delta) || delta <= 0) return null;
  const amount = delta * fuelPrice;
  return (
    <div className="p-2 rounded bg-blue-50 border mt-2 text-sm">
      <b>Preview:</b> Sale Volume: {delta}, Price: ₹{fuelPrice}, Amount: ₹{amount}
    </div>
  );
}
