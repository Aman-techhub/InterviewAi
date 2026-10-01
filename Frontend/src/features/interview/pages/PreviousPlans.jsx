import { useInterview } from "../hooks/useInterview.js";
import ProfileMenu from "../../auth/components/ProfileMenu.jsx";
import ReportList from "../components/ReportList.jsx";
import "../style/home.scss";

const PreviousPlans = () => {
  const { loading, reports = [] } = useInterview();

  if (loading) {
    return (
      <main className="loading-screen">
        <h1>Loading your interview plans...</h1>
      </main>
    );
  }

  return (
    <div className="home-page">
      <div className="home-toolbar">
        <ProfileMenu />
      </div>
      <header className="page-header">
        <h1>My <span className="highlight">Interview Plans</span></h1>
        <p>Review your previously generated interview strategies.</p>
      </header>
      <ReportList reports={reports} />
    </div>
  );
};

export default PreviousPlans;
