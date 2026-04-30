import React from "react";
import {
  ShieldCheck,
  GraduationCap,
  BookOpen,
  BarChart3,
  Users,
  ClipboardCheck,
} from "lucide-react";

export default function LandingPage({
  onGoToLogin,
  onGoToSignUp,
}: {
  onGoToLogin: () => void;
  onGoToSignUp: () => void;
}) {
  return (
    <div className="min-h-screen bg-white">
      {/* --- Hero Section --- */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
            Welcome to <span className="text-blue-600">LearnMate</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The ultimate platform connecting teachers, students, and
            administrators to streamline your educational experience.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onGoToSignUp}
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
            >
              Get Started
            </button>
            <button
              onClick={onGoToLogin}
              className="w-full sm:w-auto px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Log In
            </button>
          </div>
        </div>
      </section>

      {/* --- Role-Based Features --- */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">
            Designed for Every Role
          </h2>
          <p className="text-gray-600 mt-4">
            Tailored tools for everyone in your school ecosystem.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Admin Column */}
          <div className="p-8 bg-blue-50 rounded-2xl border border-blue-100">
            <ShieldCheck className="w-12 h-12 text-blue-600 mb-6" />
            <h3 className="text-xl font-bold mb-4">Administrators</h3>
            <ul className="space-y-3 text-gray-700 text-sm">
              <li>• Real-time School Analytics</li>
              <li>• Bulk User Management </li>
              <li>• Class & Faculty Provisioning </li>
            </ul>
          </div>

          {/* Teacher Column */}
          <div className="p-8 bg-green-50 rounded-2xl border border-green-100">
            <GraduationCap className="w-12 h-12 text-green-600 mb-6" />
            <h3 className="text-xl font-bold mb-4">Teachers</h3>
            <ul className="space-y-3 text-gray-700 text-sm">
              <li>• Native MCQ Assessments </li>
              <li>• Automated Attendance Tracking </li>
              <li>• Digital Grading & Feedback </li>
            </ul>
          </div>

          {/* Student Column */}
          <div className="p-8 bg-orange-50 rounded-2xl border border-orange-100">
            <BookOpen className="w-12 h-12 text-orange-600 mb-6" />
            <h3 className="text-xl font-bold mb-4">Students</h3>
            <ul className="space-y-3 text-gray-700 text-sm">
              <li>• Personalized Progress Dashboard </li>
              <li>• Seamless Assignment Submission </li>
              <li>• Attendance & Grade Records </li>
            </ul>
          </div>
        </div>
      </section>

      {/* --- How It Works --- */}
      <section className="bg-gray-900 py-20 px-4 text-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">
            How LearnMate Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                1
              </div>
              <p className="font-semibold">Register School </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                2
              </div>
              <p className="font-semibold">Onboard Staff </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                3
              </div>
              <p className="font-semibold">Create Classes </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                4
              </div>
              <p className="font-semibold">Start Learning </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
