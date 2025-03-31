import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { signIn, signOut, useSession } from "next-auth/react";
import { getProviders } from "next-auth/react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { CSVLink } from "react-csv";

const questions = [
  { id: 1, text: "What's your name?", type: "text" },
  { id: 2, text: "What's your email?", type: "email" },
  { id: 3, text: "How satisfied are you with our service?", type: "rating" }
];

export default function TypeformClone() {
  const { data: session } = useSession();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  const [providers, setProviders] = useState(null);
  const [userForms, setUserForms] = useState([]);
  const [formStats, setFormStats] = useState([
    { name: "Feedback Form", responses: 12 },
    { name: "Event Signup", responses: 25 }
  ]);
  const [formResponses, setFormResponses] = useState([
    { Name: "John Doe", Email: "john@example.com", Rating: 5 },
    { Name: "Jane Smith", Email: "jane@example.com", Rating: 4 }
  ]);
  const [emailSchedule, setEmailSchedule] = useState("daily");
  const [emailRecipients, setEmailRecipients] = useState("");

  useEffect(() => {
    getProviders().then((prov) => setProviders(prov));
    if (session) {
      setUserForms([
        { id: 1, title: "Customer Feedback Form" },
        { id: 2, title: "Event Registration" }
      ]);
    }
  }, [session]);

  const handleNext = (value) => {
    setResponses({ ...responses, [questions[currentQuestion].id]: value });
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      alert("Form submitted! Thank you.");
    }
  };

  const sendEmailReport = () => {
    alert(`Automated email reports scheduled: ${emailSchedule} to ${emailRecipients}`);
    // Future implementation: Send an email with form stats and responses
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-6">
      <Card className="w-[400px] p-6 shadow-lg mb-6">
        <CardContent>
          {!session ? (
            <>
              {providers && 
                Object.values(providers).map((provider) => (
                  <Button key={provider.id} onClick={() => signIn(provider.id)} className="w-full mb-2">
                    Sign in with {provider.name}
                  </Button>
                ))}
            </>
          ) : (
            <>
              <motion.div
                key={questions[currentQuestion].id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-xl font-semibold mb-4">{questions[currentQuestion].text}</h2>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  onChange={(e) => setResponses({ ...responses, [questions[currentQuestion].id]: e.target.value })}
                />
                <Button className="mt-4 w-full" onClick={() => handleNext(responses[questions[currentQuestion].id])}>
                  Next
                </Button>
              </motion.div>
              <Button onClick={() => signOut()} className="mt-4 w-full">Sign out</Button>
            </>
          )}
        </CardContent>
      </Card>

      {session && (
        <Card className="w-[400px] p-6 shadow-lg mb-6">
          <CardContent>
            <h2 className="text-xl font-semibold mb-4">Automated Email Reports</h2>
            <label className="block mb-2">Email Schedule:</label>
            <select
              className="w-full p-2 border rounded mb-4"
              value={emailSchedule}
              onChange={(e) => setEmailSchedule(e.target.value)}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
            <label className="block mb-2">Recipients:</label>
            <input
              type="text"
              className="w-full p-2 border rounded mb-4"
              placeholder="Enter email addresses, separated by commas"
              value={emailRecipients}
              onChange={(e) => setEmailRecipients(e.target.value)}
            />
            <Button className="w-full" onClick={sendEmailReport}>Enable Email Reports</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
