import ProfileBadges from "../components/ProfileBadges";
import { useEffect, useState } from "react";
import { useCallback } from "react";
import { Link } from "react-router-dom";
function FriendsList({ friends, friendRequests, onAccept, onRemove }) {
  const getId = (user) => user?.id || user?._id;

  return (
    <section className="panel">
      <div className="section-head">
        <div>
          <h3>Friends</h3>
          <p className="supporting-copy">Manage study connections and jump into private messages.</p>
        </div>
      </div>
      <div className="friend-list-block">
        <strong>Friends</strong>
        {friends?.length ? (
          <div className="friend-card-list">
            {friends.map((f) => (
              <article className="friend-card" key={getId(f)}>
                <div>
                  <Link className="inline-link" to={`/users/${getId(f)}`}>
                    <strong>{f.username}</strong>
                  </Link>
                  <p className="muted-text">{f.email}</p>
                </div>
                <div className="admin-actions">
                  <Link className="btn btn-small btn-muted" to={`/messages?userId=${getId(f)}`}>
                  Message
                </Link>
                  <button className="btn btn-small btn-ghost" type="button" onClick={() => onRemove(getId(f))}>
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : <p className="muted-text">No friends yet. Use Messages to search for classmates.</p>}
      </div>
      <div className="friend-list-block">
        <strong>Friend Requests</strong>
        {friendRequests?.length ? (
          <div className="friend-card-list">
            {friendRequests.map((f) => (
              <article className="friend-card" key={getId(f)}>
                <div>
                  <Link className="inline-link" to={`/users/${getId(f)}`}>
                    <strong>{f.username}</strong>
                  </Link>
                  <p className="muted-text">{f.email}</p>
                </div>
                <button className="btn btn-success btn-small" type="button" onClick={() => onAccept(getId(f))}>
                  Accept
                </button>
              </article>
            ))}
          </div>
        ) : <p className="muted-text">No pending requests.</p>}
      </div>
    </section>
  );
}
import {
  AnsweredCasesList,
  DifficultyBars,
  MetricCard,
  PerformanceDots,
  ProgressChart,
  RecentCommentsList,
  RecentPerformanceList,
} from "../components/ProfileBlocks";
import { api } from "../lib/api";

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [error, setError] = useState("");

  const loadProfile = useCallback(() => {
    api("/users/me")
      .then((result) => {
        setProfile(result.user);
        setFriends(result.user.friends || []);
        setFriendRequests(result.user.friendRequests || []);
      })
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleAccept = async (requesterId) => {
    await api(`/users/friends/accept/${requesterId}`, { method: "POST" });
    loadProfile();
  };
  const handleRemove = async (friendId) => {
    await api(`/users/friends/remove/${friendId}`, { method: "POST" });
    loadProfile();
  };

  if (error) return <p className="error">{error}</p>;
  if (!profile) return <p>Loading profile...</p>;

  return (
    <section className="profile-shell">
      <div className="panel profile-hero">
        <div>
          <p className="eyebrow">Learning Profile</p>
          <h2>{profile.username}</h2>
          <p className="supporting-copy">{profile.email}</p>
          <ProfileBadges badges={profile.badges} role={profile.role} />
        </div>
        <div className="profile-focus-card">
          <span className="metric-label">Training completion</span>
          <strong>{profile.progressPercent}%</strong>
          <ProgressChart value={profile.progressPercent} />
          <span className="metric-hint">
            {profile.completedCasesCount} completed, {profile.remainingCasesCount} left in the current bank
          </span>
        </div>
      </div>



      <div className="metrics-grid profile-metrics-grid">
        <MetricCard label="Score" value={profile.reputationScore} hint="Total reputation from case work" />
        <MetricCard label="Level" value={profile.level} hint="Unlocked by sustained activity" />
        <MetricCard label="Accuracy" value={`${profile.accuracyRate}%`} hint={`${profile.correctVotes} correct answers`} />
        <MetricCard label="Comments" value={profile.commentsCount} hint="Community discussion contributions" />
        <MetricCard label="Confidence" value={`${profile.confidenceScore}%`} hint="Blends accuracy and repetition" />
        <MetricCard label="Cases Done" value={profile.completedCasesCount} hint={`${profile.totalVotes} total submissions`} />
      </div>

      <div className="profile-grid">
        <section className="panel">
          <div className="section-head">
            <div>
              <h3>Recent answers</h3>
            </div>
          </div>
          <PerformanceDots items={profile.recentPerformance} />
          <RecentPerformanceList items={profile.recentPerformance} />
        </section>

        <section className="panel">
          <div className="section-head">
            <div>
              <h3>Difficulty Breakdown</h3>
            </div>
          </div>
          <DifficultyBars items={profile.difficultyBreakdown || []} />
        </section>
      </div>

      <section className="panel">
        <div className="section-head">
          <div>
            <h3>Answered Cases</h3>
            <p className="supporting-copy">Jump back into any case you have already completed.</p>
          </div>
        </div>
        <AnsweredCasesList items={profile.answeredCases} />
      </section>

      <section className="panel">
        <div className="section-head">
          <div>
            <h3>Recent Comments</h3>
            <p className="supporting-copy">Your latest discussion activity across cases.</p>
          </div>
        </div>
        <RecentCommentsList items={profile.recentComments} />
      </section>
      <FriendsList friends={friends} friendRequests={friendRequests} onAccept={handleAccept} onRemove={handleRemove} />
    </section>
  );
}

export default ProfilePage;
