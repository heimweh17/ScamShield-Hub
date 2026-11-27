import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section className="panel">
      <h2>Page not found</h2>
      <p className="supporting-copy">The page may have moved. Your practice cases are in the library.</p>
      <Link to="/cases" className="btn btn-primary">
        Open case library
      </Link>
    </section>
  );
}

export default NotFoundPage;
