export default function ProfileBadges({ badges = [], role }) {
  return (
    <div className="badge-row">
      <span className="role-pill">{role}</span>
      {badges.length > 0 && (
        <details>
          <summary>Achievements ({badges.length})</summary>
          <div className="badge-list">{badges.map((badge) => (
            <span className="badge-pill" key={badge}>{badge.replaceAll("_", " ")}</span>
          ))}</div>
        </details>
      )}
    </div>
  );
}
