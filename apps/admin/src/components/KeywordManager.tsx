import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Bot } from 'lucide-react';
import toast from 'react-hot-toast';

interface KeywordRule {
  id: string;
  keyword: string;
  subreddit?: string;
  responseTemplate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function KeywordManager() {
  const [keywords, setKeywords] = useState<KeywordRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingKeyword, setEditingKeyword] = useState<KeywordRule | null>(null);
  const [newKeyword, setNewKeyword] = useState({
    keyword: '',
    subreddit: '',
    responseTemplate: '',
    isActive: true,
  });

  useEffect(() => {
    fetchKeywords();
  }, []);

  const fetchKeywords = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/keywords');
      const result = await response.json();
      
      if (result.success) {
        setKeywords(result.data);
      } else {
        toast.error('Failed to fetch keywords');
      }
    } catch (error) {
      console.error('Failed to fetch keywords:', error);
      toast.error('Failed to fetch keywords');
    } finally {
      setIsLoading(false);
    }
  };

  const addKeyword = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newKeyword),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setKeywords([result.data, ...keywords]);
        setNewKeyword({ keyword: '', subreddit: '', responseTemplate: '', isActive: true });
        setShowAddForm(false);
        toast.success('Keyword rule added successfully');
      } else {
        toast.error(result.error || 'Failed to add keyword rule');
      }
    } catch (error) {
      console.error('Failed to add keyword:', error);
      toast.error('Failed to add keyword rule');
    }
  };

  const updateKeyword = async (id: string, updates: Partial<KeywordRule>) => {
    try {
      const response = await fetch(`http://localhost:8080/api/keywords/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setKeywords(keywords.map(k => k.id === id ? result.data : k));
        setEditingKeyword(null);
        toast.success('Keyword rule updated successfully');
      } else {
        toast.error(result.error || 'Failed to update keyword rule');
      }
    } catch (error) {
      console.error('Failed to update keyword:', error);
      toast.error('Failed to update keyword rule');
    }
  };

  const deleteKeyword = async (id: string) => {
    if (!confirm('Are you sure you want to delete this keyword rule?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/keywords/${id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        setKeywords(keywords.filter(k => k.id !== id));
        toast.success('Keyword rule deleted successfully');
      } else {
        toast.error(result.error || 'Failed to delete keyword rule');
      }
    } catch (error) {
      console.error('Failed to delete keyword:', error);
      toast.error('Failed to delete keyword rule');
    }
  };

  const toggleKeyword = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/keywords/${id}/toggle`, {
        method: 'POST',
      });
      
      const result = await response.json();
      
      if (result.success) {
        setKeywords(keywords.map(k => k.id === id ? result.data : k));
        toast.success(`Keyword rule ${result.data.isActive ? 'activated' : 'deactivated'}`);
      } else {
        toast.error(result.error || 'Failed to toggle keyword rule');
      }
    } catch (error) {
      console.error('Failed to toggle keyword:', error);
      toast.error('Failed to toggle keyword rule');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-netia-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Keyword Rules</h1>
          <p className="text-gray-600">Manage how Netia responds to specific keywords on Reddit</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Keyword Rule
        </button>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingKeyword) && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingKeyword ? 'Edit Keyword Rule' : 'Add New Keyword Rule'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Keyword</label>
              <input
                type="text"
                placeholder="e.g., dental cleaning, appointment, pricing"
                value={editingKeyword ? editingKeyword.keyword : newKeyword.keyword}
                onChange={(e) => {
                  if (editingKeyword) {
                    setEditingKeyword({ ...editingKeyword, keyword: e.target.value });
                  } else {
                    setNewKeyword({ ...newKeyword, keyword: e.target.value });
                  }
                }}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subreddit (optional)</label>
              <input
                type="text"
                placeholder="e.g., r/dentistry, r/healthcare"
                value={editingKeyword ? editingKeyword.subreddit || '' : newKeyword.subreddit}
                onChange={(e) => {
                  if (editingKeyword) {
                    setEditingKeyword({ ...editingKeyword, subreddit: e.target.value });
                  } else {
                    setNewKeyword({ ...newKeyword, subreddit: e.target.value });
                  }
                }}
                className="input-field"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Response Template</label>
            <textarea
              placeholder="Describe how Netia should respond when this keyword is detected..."
              value={editingKeyword ? editingKeyword.responseTemplate : newKeyword.responseTemplate}
              onChange={(e) => {
                if (editingKeyword) {
                  setEditingKeyword({ ...editingKeyword, responseTemplate: e.target.value });
                } else {
                  setNewKeyword({ ...newKeyword, responseTemplate: e.target.value });
                }
              }}
              className="input-field h-24"
            />
          </div>

          <div className="mt-4 flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={editingKeyword ? editingKeyword.isActive : newKeyword.isActive}
                onChange={(e) => {
                  if (editingKeyword) {
                    setEditingKeyword({ ...editingKeyword, isActive: e.target.checked });
                  } else {
                    setNewKeyword({ ...newKeyword, isActive: e.target.checked });
                  }
                }}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Active</span>
            </label>
            
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingKeyword(null);
                  setNewKeyword({ keyword: '', subreddit: '', responseTemplate: '', isActive: true });
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (editingKeyword) {
                    updateKeyword(editingKeyword.id, editingKeyword);
                  } else {
                    addKeyword();
                  }
                }}
                className="btn-primary"
              >
                {editingKeyword ? 'Update' : 'Add'} Keyword Rule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keywords List */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Active Keyword Rules ({keywords.filter(k => k.isActive).length})
        </h2>
        
        {keywords.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Bot className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No keyword rules found</p>
            <p className="text-sm">Add your first keyword rule to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {keywords.map((keyword) => (
              <div key={keyword.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-900">"{keyword.keyword}"</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        keyword.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {keyword.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Subreddit: {keyword.subreddit || 'All subreddits'}
                    </p>
                    <p className="text-sm text-gray-500 bg-gray-50 p-2 rounded">
                      {keyword.responseTemplate}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => toggleKeyword(keyword.id)}
                      className="text-gray-400 hover:text-gray-600"
                      title={keyword.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {keyword.isActive ? (
                        <ToggleRight className="h-5 w-5 text-green-500" />
                      ) : (
                        <ToggleLeft className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                    <button
                      onClick={() => setEditingKeyword(keyword)}
                      className="text-gray-400 hover:text-gray-600"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteKeyword(keyword.id)}
                      className="text-gray-400 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

