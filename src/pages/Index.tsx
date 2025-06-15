
// Landing page with a CTA to dashboard

import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-primary tracking-tight">
            Fuel Station Owner Dashboard
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Monitor sales, refills, stock, and pump usage at a glance – a powerful SaaS dashboard for modern station owners.
          </p>
        </div>
        <button
          onClick={() => navigate("/owner-dashboard")}
          className="bg-primary text-primary-foreground px-7 py-3 rounded-lg font-semibold text-lg shadow hover:bg-primary/90 transition"
        >
          Go to Dashboard
        </button>
        <div className="text-muted-foreground text-xs italic">Demo role: owner</div>
      </div>
    </div>
  );
};

export default Index;
