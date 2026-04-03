import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Class, Assignment, Submission, mockStudents } from '../TeacherDashboard';
import { FileText, Save, CheckCircle2, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { toast } from 'sonner';

interface GradingTabProps {
  selectedClass: Class;
}

const mockAssignments: Assignment[] = [
  {
    id: 'a1',
    title: 'Chapter 5 Quiz',
    description: 'Complete the quiz covering topics from Chapter 5',
    classId: 'c1',
    dueDate: '2026-01-15',
    totalPoints: 100,
    createdAt: '2026-01-05'
  },
  {
    id: 'a2',
    title: 'Problem Set 3',
    description: 'Solve problems 1-20 from the textbook',
    classId: 'c1',
    dueDate: '2026-01-20',
    totalPoints: 50,
    createdAt: '2026-01-06'
  },
];

const initialSubmissions: Submission[] = [
  { id: 'sub1', assignmentId: 'a1', studentId: 's1', submittedAt: '2026-01-07T10:30:00', fileUrl: 'assignment1.pdf', grade: 85, feedback: 'Good work!' },
  { id: 'sub2', assignmentId: 'a1', studentId: 's2', submittedAt: '2026-01-07T14:20:00', fileUrl: 'assignment1.pdf', grade: 78, feedback: 'Well done' },
  { id: 'sub3', assignmentId: 'a1', studentId: 's3', submittedAt: '2026-01-07T09:15:00', fileUrl: 'assignment1.pdf', grade: 92, feedback: 'Excellent!' },
  { id: 'sub4', assignmentId: 'a1', studentId: 's4', submittedAt: '2026-01-07T11:45:00', fileUrl: 'assignment1.pdf' },
  { id: 'sub5', assignmentId: 'a2', studentId: 's1', submittedAt: '2026-01-08T10:30:00', fileUrl: 'assignment2.pdf', grade: 45 },
  { id: 'sub6', assignmentId: 'a2', studentId: 's2', submittedAt: '2026-01-08T14:20:00', fileUrl: 'assignment2.pdf' },
];

export default function GradingTab({ selectedClass }: GradingTabProps) {
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [gradeInput, setGradeInput] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');

  const assignments = mockAssignments.filter(a => a.classId === selectedClass.id);
  const classStudents = mockStudents.filter(s => s.classId === selectedClass.id);

  const handleGradeSubmission = () => {
    if (!selectedSubmission) return;

    const grade = parseInt(gradeInput);
    const assignment = assignments.find(a => a.id === selectedSubmission.assignmentId);
    
    if (isNaN(grade) || grade < 0 || (assignment && grade > assignment.totalPoints)) {
      toast.error('Please enter a valid grade');
      return;
    }

    setSubmissions(prev =>
      prev.map(sub =>
        sub.id === selectedSubmission.id
          ? { ...sub, grade, feedback: feedbackInput }
          : sub
      )
    );

    toast.success('Grade saved successfully!');
    setSelectedSubmission(null);
    setGradeInput('');
    setFeedbackInput('');
  };

  const openGradingDialog = (submission: Submission) => {
    setSelectedSubmission(submission);
    setGradeInput(submission.grade?.toString() || '');
    setFeedbackInput(submission.feedback || '');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Grade Submissions</CardTitle>
          <CardDescription>Review and grade student submissions</CardDescription>
        </CardHeader>
      </Card>

      {assignments.map((assignment) => {
        const assignmentSubmissions = submissions.filter(s => s.assignmentId === assignment.id);
        const gradedCount = assignmentSubmissions.filter(s => s.grade !== undefined).length;
        const avgGrade = assignmentSubmissions.length > 0
          ? Math.round(
              assignmentSubmissions
                .filter(s => s.grade !== undefined)
                .reduce((sum, s) => sum + (s.grade || 0), 0) / gradedCount || 0
            )
          : 0;

        return (
          <Card key={assignment.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{assignment.title}</CardTitle>
                  <CardDescription>{assignment.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline">
                    {gradedCount} / {assignmentSubmissions.length} Graded
                  </Badge>
                  {gradedCount > 0 && (
                    <Badge variant="secondary">
                      Avg: {avgGrade}%
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {classStudents.map((student) => {
                  const submission = assignmentSubmissions.find(s => s.studentId === student.id);

                  if (!submission) {
                    return (
                      <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg opacity-60">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-semibold">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-gray-600">No submission</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-gray-500">
                          <X className="h-3 w-3 mr-1" />
                          Not Submitted
                        </Badge>
                      </div>
                    );
                  }

                  return (
                    <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-gray-600">
                            Submitted {new Date(submission.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {submission.grade !== undefined ? (
                          <div className="text-right mr-3">
                            <p className="font-semibold text-lg">
                              {submission.grade}/{assignment.totalPoints}
                            </p>
                            <p className="text-xs text-gray-600">
                              {Math.round((submission.grade / assignment.totalPoints) * 100)}%
                            </p>
                          </div>
                        ) : (
                          <Badge variant="secondary">Pending</Badge>
                        )}
                        <Button
                          size="sm"
                          variant={submission.grade !== undefined ? "outline" : "default"}
                          onClick={() => openGradingDialog(submission)}
                        >
                          {submission.grade !== undefined ? 'Edit Grade' : 'Grade'}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Grading Dialog */}
      <Dialog open={!!selectedSubmission} onOpenChange={(open) => !open && setSelectedSubmission(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Grade Submission</DialogTitle>
            <DialogDescription>
              {selectedSubmission && (
                <>
                  Student: {classStudents.find(s => s.id === selectedSubmission.studentId)?.name}
                  <br />
                  Assignment: {assignments.find(a => a.id === selectedSubmission.assignmentId)?.title}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="grade">Grade (out of {assignments.find(a => a.id === selectedSubmission?.assignmentId)?.totalPoints})</Label>
              <Input
                id="grade"
                type="number"
                placeholder="Enter grade"
                value={gradeInput}
                onChange={(e) => setGradeInput(e.target.value)}
                min="0"
                max={assignments.find(a => a.id === selectedSubmission?.assignmentId)?.totalPoints}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedback">Feedback (Optional)</Label>
              <Textarea
                id="feedback"
                placeholder="Enter feedback for the student..."
                rows={4}
                value={feedbackInput}
                onChange={(e) => setFeedbackInput(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setSelectedSubmission(null)}>
                Cancel
              </Button>
              <Button onClick={handleGradeSubmission}>
                <Save className="h-4 w-4 mr-2" />
                Save Grade
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Grade Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Grade Summary</CardTitle>
          <CardDescription>Overall class performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Submissions</p>
              <p className="text-3xl font-semibold mt-1">{submissions.length}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Graded</p>
              <p className="text-3xl font-semibold mt-1">
                {submissions.filter(s => s.grade !== undefined).length}
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Class Average</p>
              <p className="text-3xl font-semibold mt-1">85%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
