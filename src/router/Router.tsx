import usePath from '../hooks/usePath';
import { RouteProps } from './Route';

interface RouterProps {
  children: React.ReactElement<RouteProps>[];
}

const Router = ({ children }: RouterProps) => {
  const currentPath = usePath();
  return (
    <>
      {children?.map((router: React.ReactElement<RouteProps>) => {
        if (router.props.path == currentPath) return router;
      })}
    </>
  );
};

export default Router;
