import { useState } from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  const [answer, setAnswer] = useState("");
  return (
    <section className="practice-intro">
      <div className="practice-copy">
        <h1>Would you trust this message?</h1>
        <p>Practice spotting scams in emails, texts, and websites. Inspect the sender and the request, then compare your judgment with the explanation.</p>
        <Link className="btn btn-primary" to="/cases">Browse practice cases</Link>
      </div>
      <article className="specimen">
        <header>Practice email <span>Unscored</span></header>
        <dl><dt>From</dt><dd>support@secure-alerts.com</dd></dl>
        <blockquote>Urgent notice: your account will be suspended. Confirm identity at https://secure-alerts.com/login now.</blockquote>
        <fieldset><legend>How would you classify it?</legend>
          {["Scam", "Safe", "Unsure"].map((choice) => (
            <button key={choice} type="button" aria-pressed={choice === answer} onClick={() => setAnswer(choice)}>{choice}</button>
          ))}
        </fieldset>
        <div aria-live="polite">{answer && <p className="sample-result"><strong>{answer === "Scam" ? "Correct." : "This is a scam."}</strong> The sender threatens suspension to rush you into entering credentials on an unfamiliar domain.</p>}</div>
      </article>
    </section>
  );
}
