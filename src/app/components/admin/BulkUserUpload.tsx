import axios from "axios";
import { Loader2, UserPlus2Icon, Plus } from "lucide-react";
import Papa from "papaparse";
import { ChangeEvent, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";

const acceptableFileType =
  "application/vnd.ms-excel, application/csv, text/csv, text/plain, text/x-csv, text/comma-separated-values, ";

export default function BulkUserUpload({
  schoolId,
  schoolName,
  accessToken,
  userId,
  onChange,
}: {
  schoolId: string;
  schoolName: string;
  accessToken: string;
  userId: string;
  onChange: () => void;
}) {
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadErrors, setUploadErrors] = useState<
    { email: string; error: string }[]
  >([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    setSelectedFile(event.target.files[0]);
    setParseError(null);
    setUploadErrors([]);
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    setLoading(true);
    setUploadErrors([]);
    setParseError(null);
    
    Papa.parse(selectedFile, {
      skipEmptyLines: true,
      header: true,
      complete: async function (results) {
        if (results.errors.length > 0) {
          const errorMessage = Array.from(new Set(results.errors.map((err) => err.message))).join(", ");
          setParseError(`File format issue: ${errorMessage}. Please check your file.`);
          setLoading(false);
          return;
        }

        if (!results.data || results.data.length === 0) {
          setParseError("The file appears to be empty or contains no valid data rows.");
          setLoading(false);
          return;
        }

        // Validate required headers
        if (results.meta && results.meta.fields) {
          const requiredFields = ["firstName", "lastName", "email", "role"];
          const fields = results.meta.fields.map(f => f.trim());
          const missingFields = requiredFields.filter(f => !fields.includes(f));
          
          if (missingFields.length > 0) {
            setParseError(`Missing required columns: ${missingFields.join(", ")}. Please ensure your CSV has the correct headers.`);
            setLoading(false);
            return;
          }
        }

        Promise.all(
          results.data.map((student: any) =>
            handleCreateUser({
              firstName: student.firstName,
              lastName: student.lastName,
              role: student.role
                ? String(student.role).toLowerCase().trim()
                : "",
              email: student.email,
            }),
          ),
        )
          .then((uploadResults) => {
            const validResults = uploadResults.filter(Boolean);
            const successes = validResults.filter((r: any) => r.success);
            const failures = validResults.filter((r: any) => !r.success);

            if (failures.length > 0) {
              setUploadErrors(
                failures.map((f: any) => ({
                  email: f.email || "Unknown",
                  error: String(f.error || "Unknown error"),
                })),
              );
              if (successes.length > 0) {
                toast.success(
                  `Successfully created ${successes.length} users. Follow the prompt to review the failures.`,
                );
              }
            } else {
              if (successes.length > 0) {
                toast.success(`Successfully created ${successes.length} users`);
              }
              setIsCreateUserDialogOpen(false);
              onChange();
            }
          })
          .catch((error) => {
            console.error("Error creating students:", error);
            toast.error("An unexpected error occurred during bulk upload");
          })
          .finally(() => {
            setLoading(false);
            if (!parseError) {
              setSelectedFile(null);
            }
          });
      },
    });
  };

  const handleCreateUser = async ({
    firstName,
    lastName,
    role,
    email,
  }: {
    firstName: string;
    lastName: string;
    role: string;
    email: string;
  }) => {
    if (!firstName || !email || !role || !lastName) {
      return null;
    }
    try {
      await axios.post(
        `https://learn-mate--sqwads9849-s5ig82ke.leapcell.dev/admin/users?user_id=${userId}`,
        {
          firstName,
          lastName,
          role,
          email,
          password: lastName.toLowerCase().trim(),
          schoolId,
          schoolName,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );
      return { success: true, email };
    } catch (error: any) {
      return {
        success: false,
        error: error?.response?.data?.detail || "Error creating user",
        email,
      };
    }
  };

  return (
    <Dialog
      open={isCreateUserDialogOpen}
      onOpenChange={(open) => {
        setIsCreateUserDialogOpen(open);
        if (!open) {
          setUploadErrors([]);
          setParseError(null);
          setSelectedFile(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <UserPlus2Icon className="h-4 w-4 mr-2" />
          Upload Bulk Users
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Import users by CSV</DialogTitle>
          <DialogDescription className="sr-only">
            Upload a csv file which contains details of all the teacher or
            student to be added to the platform.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="animate-spin h-8 w-8 mb-4 text-gray-500" />
              <p className="text-center text-sm text-gray-600">
                Creating users... Please wait.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative border border-dashed border-gray-300 rounded-xl p-16 flex flex-col items-center justify-center bg-white hover:bg-gray-50 transition-colors">
                <input
                  type="file"
                  id="upload"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={onFileChange}
                  accept={acceptableFileType}
                  disabled={loading}
                />
                <Button
                  variant="outline"
                  className="pointer-events-none bg-white font-medium text-wrap truncate w-40"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {selectedFile ? selectedFile.name : "Add file"}
                </Button>
              </div>

              {parseError && (
                <div className="mt-4 p-3 bg-red-50 text-red-800 rounded-md border border-red-200 text-sm">
                  <p className="font-semibold mb-1">File Error:</p>
                  <p>{parseError}</p>
                </div>
              )}

              {uploadErrors.length > 0 && (
                <div className="mt-4 p-3 bg-red-50 text-red-800 rounded-md max-h-48 overflow-y-auto border border-red-200">
                  <p className="font-semibold mb-2">
                    Upload Errors ({uploadErrors.length}):
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {uploadErrors.map((err, idx) => (
                      <li key={idx}>
                        <strong>{err.email}</strong>: {err.error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t pt-4">
          <a
            href="https://docs.google.com/spreadsheets/d/13slZlBaDCHkA4FkUNulQWOUrx0byNcNTDok3mNpp5rw/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            Download sample CSV
          </a>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setIsCreateUserDialogOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={!selectedFile || loading}>
              Upload and preview
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
