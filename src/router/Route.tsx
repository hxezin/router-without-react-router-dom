export interface RouteProps {
  path: string;
  component: React.ReactNode;
}

const Route = ({ component }: RouteProps) => {
  return <>{component}</>;
};

export default Route;
