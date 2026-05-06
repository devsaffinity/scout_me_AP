import { Suspense, useMemo } from "react";
import { useRoutes } from "react-router-dom";
import "./App.css";
import ToastViewport from "./components/shared/ToastViewport";
import routeConfig from "./routes/routeConfig";

function AppLoader() {
  return (
    <div className="app-suspense">
      <div className="app-suspense__content">
        <span className="app-suspense__spinner" />
        <p className="app-suspense__label">Loading ScoutMe Admin...</p>
      </div>
    </div>
  );
}

function App() {
  const routing = useMemo(() => routeConfig, []);
  const routes = useRoutes(routing);

  return (
    <div className="app-root page-fade-in">
      <Suspense fallback={<AppLoader />}>{routes}</Suspense>
      <ToastViewport />
    </div>
  );
}

export default App;
