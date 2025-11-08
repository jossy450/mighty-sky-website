import { useAuth } from "@/_core/hooks/useAuth";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Loader2, Search, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function KnowledgeBase() {
  const { user, loading, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");

  // Fetch all Q&A pairs
  const { data: knowledgeBasePairs, isLoading, refetch } = trpc.knowledgeBase.getAll.useQuery(
    undefined,
    { enabled: isAuthenticated && user?.role === "admin" }
  );

  // Mutations
  const updateMutation = trpc.knowledgeBase.update.useMutation({
    onSuccess: () => {
      toast.success("Q&A pair updated successfully");
      setEditingId(null);
      refetch();
    },
    onError: () => {
      toast.error("Failed to update Q&A pair");
    },
  });

  const deleteMutation = trpc.knowledgeBase.delete.useMutation({
    onSuccess: () => {
      toast.success("Q&A pair deleted successfully");
      refetch();
    },
    onError: () => {
      toast.error("Failed to delete Q&A pair");
    },
  });

  const createMutation = trpc.knowledgeBase.create.useMutation({
    onSuccess: () => {
      toast.success("Q&A pair created successfully");
      setIsCreating(false);
      setNewQuestion("");
      setNewAnswer("");
      refetch();
    },
    onError: () => {
      toast.error("Failed to create Q&A pair");
    },
  });

  // Filter pairs based on search query
  const filteredPairs = knowledgeBasePairs?.filter(
    (pair) =>
      pair.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pair.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (id: number, question: string, answer: string) => {
    setEditingId(id);
    setEditQuestion(question);
    setEditAnswer(answer);
  };

  const handleSaveEdit = () => {
    if (editingId && editQuestion && editAnswer) {
      updateMutation.mutate({ id: editingId, question: editQuestion, answer: editAnswer });
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditQuestion("");
    setEditAnswer("");
  };

  const handleDelete = (id: number, question: string) => {
    if (confirm(`Are you sure you want to delete this Q&A pair?\n\nQuestion: ${question}`)) {
      deleteMutation.mutate({ id });
    }
  };

  const handleCreate = () => {
    if (newQuestion && newAnswer) {
      createMutation.mutate({ question: newQuestion, answer: newAnswer });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              You must be logged in to access the Knowledge Base Management page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href={getLoginUrl()}>Log In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              This page is restricted to administrators only. Please contact your system administrator if you believe you should have access.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <a href="/">Back to Home</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Knowledge Base Management</h1>
            <p className="text-gray-600 mt-1">Manage chatbot Q&A pairs</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsCreating(!isCreating)}>
              <Plus className="w-4 h-4 mr-2" />
              Add New Q&A
            </Button>
            <Button asChild variant="outline">
              <a href="/staff">Go to Staff Dashboard</a>
            </Button>
          </div>
        </div>

        {/* Create New Q&A Form */}
        {isCreating && (
          <Card>
            <CardHeader>
              <CardTitle>Create New Q&A Pair</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Question</label>
                <Input
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Enter the question..."
                />
              </div>
              <div>
                <label className="text-sm font-medium">Answer</label>
                <textarea
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="Enter the answer..."
                  className="w-full min-h-[100px] p-2 border rounded-md"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleCreate}
                  disabled={!newQuestion || !newAnswer || createMutation.isPending}
                >
                  {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Create
                </Button>
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search questions or answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Q&A Pairs List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : filteredPairs && filteredPairs.length > 0 ? (
          <div className="space-y-4">
            {filteredPairs.map((pair) => (
              <Card key={pair.id}>
                <CardContent className="pt-6">
                  {editingId === pair.id ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Question</label>
                        <Input
                          value={editQuestion}
                          onChange={(e) => setEditQuestion(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Answer</label>
                        <textarea
                          value={editAnswer}
                          onChange={(e) => setEditAnswer(e.target.value)}
                          className="w-full min-h-[100px] p-2 border rounded-md"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSaveEdit}
                          disabled={updateMutation.isPending}
                          size="sm"
                        >
                          {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                          Save
                        </Button>
                        <Button variant="outline" onClick={handleCancelEdit} size="sm">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">Q: {pair.question}</h3>
                          <p className="text-gray-700">A: {pair.answer}</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(pair.id, pair.question, pair.answer)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(pair.id, pair.question)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        Created: {new Date(pair.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">
                {searchQuery
                  ? "No Q&A pairs found matching your search."
                  : "No Q&A pairs in the knowledge base yet. Add your first one!"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
