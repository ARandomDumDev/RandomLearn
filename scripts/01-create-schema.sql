-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  total_xp INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  daily_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create personalized_lessons table (JSON-based lessons with refresh logic)
CREATE TABLE IF NOT EXISTS personalized_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_data JSONB NOT NULL,
  lesson_type TEXT NOT NULL, -- 'grammar', 'vocabulary', 'writing', 'speaking', 'listening', 'idioms'
  difficulty_level INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  refreshed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP + INTERVAL '2 days'),
  completed BOOLEAN DEFAULT FALSE
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES personalized_lessons(id) ON DELETE CASCADE,
  question_index INTEGER,
  answer TEXT,
  is_correct BOOLEAN,
  xp_earned INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create word_meanings table (for spelling test practice)
CREATE TABLE IF NOT EXISTS word_meanings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  word TEXT NOT NULL,
  meaning TEXT NOT NULL,
  example_sentence TEXT,
  pronunciation TEXT,
  difficulty_level INTEGER DEFAULT 1,
  times_practiced INTEGER DEFAULT 0,
  last_practiced_at TIMESTAMP WITH TIME ZONE,
  mastered BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE personalized_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE word_meanings ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS Policies for personalized_lessons
CREATE POLICY "Users can view their own lessons" ON personalized_lessons FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own lessons" ON personalized_lessons FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own lessons" ON personalized_lessons FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own lessons" ON personalized_lessons FOR DELETE USING (auth.uid() = user_id);

-- Create RLS Policies for user_progress
CREATE POLICY "Users can view their own progress" ON user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own progress" ON user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own progress" ON user_progress FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS Policies for word_meanings
CREATE POLICY "Users can view their own words" ON word_meanings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own words" ON word_meanings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own words" ON word_meanings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own words" ON word_meanings FOR DELETE USING (auth.uid() = user_id);

-- Create RLS Policies for achievements
CREATE POLICY "Users can view their own achievements" ON achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own achievements" ON achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_personalized_lessons_user_id ON personalized_lessons(user_id);
CREATE INDEX idx_personalized_lessons_expires_at ON personalized_lessons(expires_at);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_lesson_id ON user_progress(lesson_id);
CREATE INDEX idx_word_meanings_user_id ON word_meanings(user_id);
CREATE INDEX idx_achievements_user_id ON achievements(user_id);
