const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class APIClient {
  // Persons
  async getPersons() {
    const res = await fetch(`${API_URL}/api/persons`);
    return res.json();
  }

  async createPerson(data: any) {
    const res = await fetch(`${API_URL}/api/persons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }

  async updatePerson(id: string, data: any) {
    const res = await fetch(`${API_URL}/api/persons/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }

  async deletePerson(id: string) {
    const res = await fetch(`${API_URL}/api/persons/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  }

  // Tasks
  async getTasks(active?: boolean) {
    const query = active !== undefined ? `?active=${active}` : '';
    const res = await fetch(`${API_URL}/api/tasks${query}`);
    return res.json();
  }

  async createTask(data: any) {
    const res = await fetch(`${API_URL}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }

  async updateTask(id: string, data: any) {
    const res = await fetch(`${API_URL}/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }

  async deleteTask(id: string) {
    const res = await fetch(`${API_URL}/api/tasks/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  }

  // Assignments
  async getAssignmentsByDate(date: string) {
    const res = await fetch(`${API_URL}/api/assignments/date/${date}`);
    return res.json();
  }

  async getAssignmentsByMonth(year: number, month: number) {
    const res = await fetch(`${API_URL}/api/assignments/month/${year}/${month}`);
    return res.json();
  }

  async completeAssignment(id: string, data?: any) {
    const res = await fetch(`${API_URL}/api/assignments/${id}/complete`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data || {})
    });
    return res.json();
  }

  async deleteAssignment(id: string) {
    const res = await fetch(`${API_URL}/api/assignments/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  }

  async deleteTaskAssignments(taskId: string) {
    const res = await fetch(`${API_URL}/api/assignments/task/${taskId}`, {
      method: 'DELETE'
    });
    return res.json();
  }

  // AI
  async distributeWithAI(startDate: string, endDate: string, clear: boolean = true) {
    const res = await fetch(`${API_URL}/api/ai/distribute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ startDate, endDate, clear })
    });
    return res.json();
  }

  async redistributeAll(startDate: string, endDate: string) {
    const res = await fetch(`${API_URL}/api/ai/redistribute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ startDate, endDate })
    });
    return res.json();
  }

  async analyzeBalance(startDate?: string, endDate?: string) {
    const query = startDate && endDate ? `?startDate=${startDate}&endDate=${endDate}` : '';
    const res = await fetch(`${API_URL}/api/ai/analyze-balance${query}`);
    return res.json();
  }

  async optimize() {
    const res = await fetch(`${API_URL}/api/ai/optimize`, {
      method: 'POST'
    });
    return res.json();
  }

  async getStatistics(startDate?: string, endDate?: string) {
    const query = startDate && endDate ? `?startDate=${startDate}&endDate=${endDate}` : '';
    const res = await fetch(`${API_URL}/api/ai/statistics${query}`);
    return res.json();
  }

  // Emails
  async sendTestEmail(email: string, personName: string) {
    const res = await fetch(`${API_URL}/api/emails/test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, personName })
    });
    return res.json();
  }

  async sendDailyEmails(date?: string) {
    const res = await fetch(`${API_URL}/api/emails/send-daily`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date })
    });
    return res.json();
  }

  // Email Configuration
  async getEmailConfig() {
    const res = await fetch(`${API_URL}/api/config/email`);
    return res.json();
  }

  async updateEmailConfig(config: any) {
    const res = await fetch(`${API_URL}/api/config/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    return res.json();
  }

  async testEmailConfig(config: any) {
    const res = await fetch(`${API_URL}/api/config/email/test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    return res.json();
  }

  async getEmailPresets() {
    const res = await fetch(`${API_URL}/api/config/email/presets`);
    return res.json();
  }
}

export const api = new APIClient();
