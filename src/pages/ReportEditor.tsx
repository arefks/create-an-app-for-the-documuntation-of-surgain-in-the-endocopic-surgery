import { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Download, Activity } from "lucide-react";
import { Procedure } from "@/pages/Index";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ReportEditor = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const procedure = location.state?.procedure as Procedure;

  

  // PDF of the structured layout handled within SurgicalReport component

  if (!procedure) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-6">
          <p className="text-muted-foreground mb-4">No procedure data found</p>
          <Button onClick={() => navigate("/")} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <header className="border-b border-border/50 bg-card/95 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="hover:bg-primary/10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Activity className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Medical Report Editor</h1>
                <p className="text-sm text-muted-foreground">{procedure.patientName} - {procedure.patientId}</p>
              </div>
            </div>
          </div>
          {/* The download button is provided inside the SurgicalReport component */}
          <div />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <Card className="shadow-2xl border-border/50 overflow-hidden p-6">
          <SurgicalReport procedure={procedure} />
        </Card>
      </main>
    </div>
  );
};

export default ReportEditor;

// SurgicalReport component per requested implementation
function SurgicalReport({ procedure }: { procedure?: Procedure | null }) {
  const reportRef = useRef<HTMLDivElement | null>(null);

  // Controlled fields for the report sections
  const [info, setInfo] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [findings, setFindings] = useState<string>("");
  const [diagnosis, setDiagnosis] = useState<string>("");
  const [recommendations, setRecommendations] = useState<string>("");
  const [complications, setComplications] = useState<string>("");

  useEffect(() => {
    if (procedure) {
      setInfo(
        `Patient Name: ${procedure.patientName}\nPatient ID: ${procedure.patientId}\nDate: ${new Date(
          procedure.date
        ).toLocaleString()}\nPhysician: ${procedure.surgeon || ""}\nProcedure: ${procedure.procedureType || ""}\nAnesthesia: ${procedure.anesthesia || ""}\nDuration: ${procedure.duration || ""}`
      );
      setDescription((procedure as any).description || "");
      setFindings(procedure.findings || "");
      setDiagnosis((procedure as any).diagnosis || "");
      setRecommendations((procedure as any).recommendations || "");
      setComplications(procedure.complications || "");
    }
  }, [procedure]);

  const handleDownloadPDF = async () => {
    const element = reportRef.current;
    if (!element) return;
    // Ensure focus is blurred so caret doesn't appear in capture
    (document.activeElement as HTMLElement)?.blur?.();
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${procedure?.patientId || "Surgical"}_Report.pdf`);
  };

  return (
    <div style={reportStyles.page}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={handleDownloadPDF} style={reportStyles.button}>
          Download as PDF
        </button>
      </div>
      <div ref={reportRef} style={reportStyles.report}>
        <h1 style={reportStyles.title}>Surgical Report</h1>

        <ReportSection title="Patient / Procedure Information" value={info} onChange={setInfo} />
        <ReportSection title="Description of Procedure" value={description} onChange={setDescription} />
        <ReportSection title="Findings" value={findings} onChange={setFindings} />
        <ReportSection title="Diagnosis" value={diagnosis} onChange={setDiagnosis} />
        <ReportSection title="Recommendations" value={recommendations} onChange={setRecommendations} />
        <ReportSection title="Complications" value={complications} onChange={setComplications} />
      </div>
    </div>
  );
}

function ReportSection({
  title,
  value,
  onChange,
}: {
  title: string;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div style={reportStyles.section}>
      <h2 style={reportStyles.header}>{title}</h2>
      <textarea
        style={reportStyles.textarea}
        placeholder={`Enter ${title}...`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

const reportStyles: Record<string, React.CSSProperties> = {
  page: {
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    background: "#f5f5f5",
    minHeight: "100vh",
  },
  button: {
    marginBottom: "20px",
    padding: "10px 16px",
    fontSize: "16px",
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  report: {
    background: "white",
    padding: "25px 35px",
    width: "794px", // A4 width in px at ~96dpi
    margin: "0 auto",
    borderRadius: "6px",
    boxShadow: "0 0 10px rgba(0,0,0,0.15)",
  },
  title: {
    textAlign: "center",
    marginBottom: "25px",
    fontSize: "28px",
  },
  section: {
    marginBottom: "22px",
  },
  header: {
    fontSize: "18px",
    marginBottom: "8px",
  },
  textarea: {
    width: "100%",
    minHeight: "100px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    padding: "10px",
    fontSize: "14px",
    resize: "vertical",
  },
};
