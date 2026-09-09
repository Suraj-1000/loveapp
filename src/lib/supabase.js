import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-supabase-project')
);

// Real Supabase Client (if environment variables are present)
export const realSupabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// LocalStorage Mock DB Key
const MOCK_STORAGE_KEY = 'loveapp_mock_invitations';

const getMockData = () => {
  const data = localStorage.getItem(MOCK_STORAGE_KEY);
  if (data) return JSON.parse(data);
  const initial = [
    {
      id: 'demo-uuid-1',
      invite_code: 'demo-love-2026',
      recipient_name: 'My Love',
      sender_name: 'Suraj',
      response: null,
      selected_date: null,
      selected_time: null,
      vibe: null,
      preparation_time: null,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ];
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(initial));
  return initial;
};

const saveMockData = (list) => {
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(list));
};

// Unified Supabase API Wrapper supporting real Supabase OR local mock fallback
export const supabase = {
  // Fetch invitation by code
  async getInvitation(code) {
    if (isSupabaseConfigured && realSupabase) {
      const { data, error } = await realSupabase
        .from('date_invitations')
        .select('*')
        .eq('invite_code', code)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Supabase fetch error:', error);
      }
      if (data) return { data, error: null };
    }

    // Mock Fallback
    const mockList = getMockData();
    let found = mockList.find((item) => item.invite_code === code);
    
    // If code doesn't exist yet, dynamically generate a temporary mock record
    if (!found) {
      found = {
        id: 'mock-' + Math.random().toString(36).substring(2, 9),
        invite_code: code,
        recipient_name: 'My Love',
        sender_name: 'Suraj',
        response: null,
        selected_date: null,
        selected_time: null,
        vibe: null,
        preparation_time: null,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      mockList.push(found);
      saveMockData(mockList);
    }
    
    return { data: found, error: null };
  },

  // Save girlfriend's date response & selections
  async submitResponse({ inviteCode, response, selectedDate, selectedTime, vibe, prepTime }) {
    if (isSupabaseConfigured && realSupabase) {
      const { data, error } = await realSupabase
        .from('date_invitations')
        .update({
          response,
          selected_date: selectedDate,
          selected_time: selectedTime,
          vibe,
          preparation_time: prepTime,
          status: 'confirmed',
          updated_at: new Date().toISOString(),
        })
        .eq('invite_code', inviteCode)
        .select()
        .single();

      if (!error && data) return { data, error: null };
      console.warn('Real Supabase update failed, using mock fallback:', error);
    }

    // Mock Update Fallback
    const mockList = getMockData();
    const index = mockList.findIndex((item) => item.invite_code === inviteCode);
    const updatedRecord = {
      ...mockList[index],
      response,
      selected_date: selectedDate,
      selected_time: selectedTime,
      vibe,
      preparation_time: prepTime,
      status: 'confirmed',
      updated_at: new Date().toISOString(),
    };

    if (index !== -1) {
      mockList[index] = updatedRecord;
    } else {
      mockList.push(updatedRecord);
    }
    saveMockData(mockList);

    return { data: updatedRecord, error: null };
  },

  // Admin: Get all invitations
  async getAllInvitations() {
    if (isSupabaseConfigured && realSupabase) {
      const { data, error } = await realSupabase
        .from('date_invitations')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) return { data, error: null };
    }

    // Mock Fallback
    const mockList = getMockData();
    return { data: mockList, error: null };
  },

  // Admin: Create new invitation
  async createInvitation({ inviteCode, recipientName, senderName }) {
    if (isSupabaseConfigured && realSupabase) {
      const { data, error } = await realSupabase
        .from('date_invitations')
        .insert([
          {
            invite_code: inviteCode,
            recipient_name: recipientName || 'My Love',
            sender_name: senderName || 'Suraj',
            status: 'pending',
          }
        ])
        .select()
        .single();

      if (!error && data) return { data, error: null };
    }

    // Mock Fallback
    const mockList = getMockData();
    const newRecord = {
      id: 'mock-' + Math.random().toString(36).substring(2, 9),
      invite_code: inviteCode,
      recipient_name: recipientName || 'My Love',
      sender_name: senderName || 'Suraj',
      response: null,
      selected_date: null,
      selected_time: null,
      vibe: null,
      preparation_time: null,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockList.unshift(newRecord);
    saveMockData(mockList);

    return { data: newRecord, error: null };
  },

  // Admin: Delete invitation
  async deleteInvitation(inviteCode) {
    if (isSupabaseConfigured && realSupabase) {
      const { error } = await realSupabase
        .from('date_invitations')
        .delete()
        .eq('invite_code', inviteCode);

      if (error) {
        console.error('Supabase delete error:', error);
      } else {
        return { success: true, error: null };
      }
    }

    // Mock Fallback Delete
    const mockList = getMockData();
    const filtered = mockList.filter((item) => item.invite_code !== inviteCode);
    saveMockData(filtered);
    return { success: true, error: null };
  }
};
