import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Tasks() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedBoard, setSelectedBoard] = useState("");
  const [selectedList, setSelectedList] = useState("");
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");

  // Fetch Trello boards
  const { data: boards = [], isLoading: boardsLoading } = useQuery({
    queryKey: ["/api/trello/boards"],
    queryFn: async () => {
      const response = await fetch("/api/trello/boards");
      if (!response.ok) throw new Error("Failed to fetch boards");
      return response.json();
    },
  });

  // Fetch lists for selected board
  const { data: lists = [] } = useQuery({
    queryKey: ["/api/trello/boards", selectedBoard, "lists"],
    queryFn: async () => {
      const response = await fetch(`/api/trello/boards/${selectedBoard}/lists`);
      if (!response.ok) throw new Error("Failed to fetch lists");
      return response.json();
    },
    enabled: !!selectedBoard,
  });

  // Fetch my Trello cards
  const { data: cards = [], isLoading: cardsLoading } = useQuery({
    queryKey: ["/api/trello/cards"],
    queryFn: async () => {
      const response = await fetch("/api/trello/cards");
      if (!response.ok) throw new Error("Failed to fetch cards");
      return response.json();
    },
  });

  // Create new task
  const createTaskMutation = useMutation({
    mutationFn: async (taskData: { listId: string; name: string; description: string }) => {
      return apiRequest("POST", "/api/trello/cards", taskData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trello/cards"] });
      setNewTaskName("");
      setNewTaskDescription("");
      toast({
        title: "Task Created",
        description: "Your task has been added to Trello",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create task",
        variant: "destructive",
      });
    },
  });

  // Update task
  const updateTaskMutation = useMutation({
    mutationFn: async ({ cardId, updates }: { cardId: string; updates: any }) => {
      return apiRequest("PUT", `/api/trello/cards/${cardId}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trello/cards"] });
      toast({
        title: "Task Updated",
        description: "Your task has been updated in Trello",
      });
    },
  });

  // Delete task
  const deleteTaskMutation = useMutation({
    mutationFn: async (cardId: string) => {
      return apiRequest("DELETE", `/api/trello/cards/${cardId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trello/cards"] });
      toast({
        title: "Task Deleted",
        description: "Your task has been removed from Trello",
      });
    },
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedList || !newTaskName.trim()) {
      toast({
        title: "Error",
        description: "Please select a list and enter a task name",
        variant: "destructive",
      });
      return;
    }

    createTaskMutation.mutate({
      listId: selectedList,
      name: newTaskName.trim(),
      description: newTaskDescription.trim(),
    });
  };

  if (boardsLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white">Connecting to Trello...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
            <i className="fas fa-tasks text-primary text-3xl"></i>
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-4">Task Management</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Manage your Trello tasks directly from Ascended Social. Create, update, and track your spiritual journey goals.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Create New Task */}
          <Card className="bg-cosmic-light border border-primary/30">
            <CardHeader>
              <CardTitle className="text-accent-light flex items-center">
                <i className="fas fa-plus-circle mr-2"></i>
                Create New Task
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Select Board
                  </label>
                  <select
                    value={selectedBoard}
                    onChange={(e) => {
                      setSelectedBoard(e.target.value);
                      setSelectedList("");
                    }}
                    className="w-full bg-cosmic border border-primary/30 rounded-lg p-2 text-white"
                    data-testid="select-board"
                  >
                    <option value="">Choose a board...</option>
                    {boards.map((board: any) => (
                      <option key={board.id} value={board.id}>
                        {board.name}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedBoard && (
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Select List
                    </label>
                    <select
                      value={selectedList}
                      onChange={(e) => setSelectedList(e.target.value)}
                      className="w-full bg-cosmic border border-primary/30 rounded-lg p-2 text-white"
                      data-testid="select-list"
                    >
                      <option value="">Choose a list...</option>
                      {lists.map((list: any) => (
                        <option key={list.id} value={list.id}>
                          {list.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Task Name
                  </label>
                  <Input
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                    placeholder="Enter task name..."
                    className="bg-cosmic border-primary/30 text-white"
                    data-testid="input-task-name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Description (Optional)
                  </label>
                  <Textarea
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    placeholder="Enter task description..."
                    className="bg-cosmic border-primary/30 text-white"
                    rows={3}
                    data-testid="textarea-task-description"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={createTaskMutation.isPending}
                  className="w-full bg-primary hover:bg-primary/80"
                  data-testid="button-create-task"
                >
                  {createTaskMutation.isPending ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/80 border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <i className="fas fa-plus"></i>
                      <span>Create Task</span>
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* My Tasks */}
          <Card className="bg-cosmic-light border border-primary/30">
            <CardHeader>
              <CardTitle className="text-accent-light flex items-center">
                <i className="fas fa-list-check mr-2"></i>
                My Tasks ({cards.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cardsLoading ? (
                <div className="text-center py-8">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-gray-400 text-sm">Loading tasks...</p>
                </div>
              ) : cards.length === 0 ? (
                <div className="text-center py-8">
                  <i className="fas fa-clipboard-list text-gray-500 text-4xl mb-4"></i>
                  <p className="text-gray-400">No tasks found</p>
                  <p className="text-gray-500 text-sm">Create your first task to get started</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {cards.map((card: any) => (
                    <div
                      key={card.id}
                      className="bg-cosmic/50 rounded-lg p-3 border border-primary/20"
                      data-testid={`card-task-${card.id}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-white text-sm mb-1">
                            {card.name}
                          </h4>
                          {card.desc && (
                            <p className="text-gray-400 text-xs mb-2 line-clamp-2">
                              {card.desc}
                            </p>
                          )}
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs text-white">
                              {card.list?.name || 'No List'}
                            </Badge>
                            {card.due && (
                              <Badge variant="outline" className="text-xs text-orange-400">
                                <i className="fas fa-clock mr-1"></i>
                                Due {new Date(card.due).toLocaleDateString()}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-1 ml-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                            onClick={() => window.open(card.url, '_blank')}
                            data-testid={`button-view-task-${card.id}`}
                          >
                            <i className="fas fa-external-link-alt text-xs"></i>
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                            onClick={() => deleteTaskMutation.mutate(card.id)}
                            data-testid={`button-delete-task-${card.id}`}
                          >
                            <i className="fas fa-trash text-xs"></i>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <Card className="bg-cosmic-light border border-primary/30 max-w-2xl mx-auto">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                <i className="fas fa-link mr-2 text-primary"></i>
                Connected to Trello
              </h3>
              <p className="text-gray-300 mb-4">
                Your tasks are now synchronized with Trello. Any changes made here will reflect in your Trello boards, 
                and vice versa. This integration allows for seamless task management across platforms.
              </p>
              <div className="flex justify-center space-x-4">
                <Button 
                  onClick={() => window.open('https://trello.com', '_blank')}
                  className="bg-blue-600 hover:bg-blue-500"
                  data-testid="button-open-trello"
                >
                  <i className="fas fa-external-link-alt mr-2"></i>
                  Open Trello
                </Button>
                <Button 
                  onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/trello/cards"] })}
                  variant="outline"
                  className="border-primary/30 text-primary hover:bg-primary/10"
                  data-testid="button-refresh-tasks"
                >
                  <i className="fas fa-sync-alt mr-2"></i>
                  Refresh Tasks
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}