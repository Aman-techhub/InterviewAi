import { useNavigate } from "react-router";

const ReportList = ({ reports, title = "My Interview Plans" }) => {
  const navigate = useNavigate();

  return (
    <section className="recent-reports">
      <h2>{title}</h2>
      {reports.length > 0 ? (
        <ul className="reports-list">
          {reports.map((report) => (
            <li
              key={report._id}
              className="report-item"
              onClick={() => navigate(`/interview/${report._id}`)}
            >
              <h3>{report.title || "Untitled Position"}</h3>
              <p className="report-meta">
                Generated on {new Date(report.createdAt).toLocaleDateString()}
              </p>
              <p
                className={`match-score ${report.matchScore >= 80 ? "score--high" : report.matchScore >= 60 ? "score--mid" : "score--low"}`}
              >
                Match Score: {report.matchScore}%
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="reports-empty">No interview plans yet.</p>
      )}
    </section>
  );
};

export default ReportList;
