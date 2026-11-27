import { useEffect, useState } from "react";
import CaseCard from "../components/CaseCard";
import { EmptyState, LoadingBlock, StatusBanner } from "../components/Feedback";
import { api } from "../lib/api";

function CaseFeedPage() {
  const [cases, setCases] = useState([]);
  const [difficulty, setDifficulty] = useState("");
  const [contentType, setContentType] = useState("");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let current = true;
    const params = new URLSearchParams();
    if (difficulty) params.set("difficulty", difficulty);
    if (contentType) params.set("contentType", contentType);

    setLoading(true);
    setError("");
    api(`/cases?${params.toString()}`)
      .then((result) => { if (current) setCases(result.cases); })
      .catch((err) => { if (current) setError(err.message); })
      .finally(() => { if (current) setLoading(false); });
    return () => { current = false; };
  }, [difficulty, contentType, retry]);

  const normalizedQuery = query.trim().toLowerCase();

  function sortCases(items) {
    return [...items].sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "difficulty") {
        const order = { easy: 0, medium: 1, hard: 2 };
        return (order[a.difficulty] ?? 99) - (order[b.difficulty] ?? 99);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  const filteredCases = cases.filter((item) => {
    if (!normalizedQuery) return true;
    return (
      item.title.toLowerCase().includes(normalizedQuery) ||
      item.content.toLowerCase().includes(normalizedQuery) ||
      item.contentType.toLowerCase().includes(normalizedQuery)
    );
  });

  const availableCases = sortCases(filteredCases.filter((item) => !item.attempted));
  const completedCases = sortCases(filteredCases.filter((item) => item.attempted));

  return (
    <section>
      <div className="page-title-row">
        <div>
          <h2>Case library</h2>

        </div>
        <div className="filters filters-extended">
          <input
            aria-label="Search cases"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, content, or type"
          />
          <select aria-label="Case format" value={contentType} onChange={(e) => setContentType(e.target.value)}>
            <option value="">All Types</option>
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="website">Website</option>
          </select>
          <select aria-label="Difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <select aria-label="Sort cases" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="title">Title A-Z</option>
            <option value="difficulty">Easy to Hard</option>
          </select>
        </div>
      </div>

      {loading ? <LoadingBlock label="Loading the current training bank..." /> : null}
      <StatusBanner type="error" message={error} />

      {error && <button className="btn" onClick={() => setRetry(value => value + 1)}>Retry loading cases</button>}
      {!loading && !error && <><section className="case-section">
        <div className="section-head">
          <div>
            <h3>Available cases ({availableCases.length})</h3>
          </div>
        </div>
        <div className="case-grid">
          {availableCases.map((item) => (
            <CaseCard key={item._id} item={item} />
          ))}
        </div>
        {!loading && !availableCases.length ? (
          <EmptyState
            title="No new cases in this view"
            description="No unanswered cases match this view."
            action={(query || difficulty || contentType) && <button className="btn" onClick={() => { setQuery(""); setDifficulty(""); setContentType(""); }}>Clear filters</button>}
          />
        ) : null}
      </section>

      {completedCases.length > 0 && <section className="case-section">
        <div className="section-head">
          <div>
            <h3>Completed cases ({completedCases.length})</h3>
          </div>
        </div>
        <div className="case-grid">
          {completedCases.map((item) => (
            <CaseCard key={item._id} item={item} />
          ))}
        </div>
      </section>}</>}
    </section>
  );
}

export default CaseFeedPage;
