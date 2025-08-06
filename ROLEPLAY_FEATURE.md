# DECA Roleplay Feature

This document describes the new roleplay generation feature added to DECA Pal.

## Overview

The roleplay feature allows users to practice DECA competition scenarios using AI-powered roleplay simulations. Users can generate realistic business scenarios based on the five DECA categories and engage in interactive conversations to improve their skills.

## Features

### 1. Category-Based Scenario Generation
- **Management**: Leadership, team coordination, and organizational challenges
- **Marketing**: Market research, advertising campaigns, and brand management
- **Finance**: Budgeting, financial analysis, and investment decisions
- **Hospitality**: Customer service, event planning, and hospitality operations
- **Entrepreneurship**: Startup planning, business development, and innovation

### 2. Interactive Roleplay Sessions
- Real-time conversation with AI
- Contextual responses based on the scenario
- Natural business dialogue simulation
- Session progress tracking

### 3. Session Management
- Automatic saving of roleplay sessions
- Roleplay history with detailed statistics
- Export functionality (planned)
- Progress tracking across categories

## Technical Implementation

### API Routes
- `/api/roleplay/generate` - Generates new roleplay scenarios
- `/api/roleplay/chat` - Handles interactive roleplay conversations
- `/api/roleplay/save` - Saves and retrieves roleplay sessions

### Pages
- `/roleplay` - Main roleplay page with category selection
- `/roleplay/[category]` - Category-specific roleplay generation and interaction
- `/roleplay/history` - View past roleplay sessions

### Components
- Integrated with existing navigation
- Consistent design with DECA Pal theme
- Mobile-responsive interface
- Loading states and error handling

## Setup Instructions

### 1. Environment Variables
Copy `.env.example` to `.env.local` and add your OpenRouter API key:

```bash
OPENROUTER_API_KEY=your_openrouter_api_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2. OpenRouter API Key
1. Sign up at [OpenRouter.ai](https://openrouter.ai)
2. Generate an API key
3. Add the key to your environment variables

### 3. Firebase Integration (Future Enhancement)
The current implementation includes placeholder functions for Firebase Firestore integration. To fully implement session persistence:

1. Set up Firestore collections for roleplay sessions
2. Implement the database operations in `/api/roleplay/save/route.ts`
3. Update the session retrieval logic

## Usage

### For Users
1. Navigate to "Practice Roleplays" from the homepage or navigation
2. Select a DECA category (Management, Marketing, Finance, Hospitality, Entrepreneurship)
3. Click "Generate New Scenario" to create a roleplay scenario
4. Click "Start Roleplay" to begin the interactive session
5. Engage in conversation with the AI to practice business skills
6. Save the session for later review

### For Developers
The roleplay system is built with:
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **OpenRouter API** for AI-powered conversations
- **Tailwind CSS** for styling
- **Firebase** for authentication (existing)
- **Lucide React** for icons

## File Structure

```
deca/
├── app/
│   ├── api/roleplay/
│   │   ├── generate/route.ts    # Scenario generation
│   │   ├── chat/route.ts        # Interactive chat
│   │   └── save/route.ts        # Session management
│   ├── roleplay/
│   │   ├── page.tsx             # Main roleplay page
│   │   ├── [category]/page.tsx  # Category-specific page
│   │   └── history/page.tsx     # Session history
│   ├── types.ts                 # TypeScript definitions
│   └── components/
│       └── Navigation.tsx       # Updated navigation
└── .env.example                 # Environment template
```

## Future Enhancements

1. **Firebase Firestore Integration**: Complete session persistence
2. **Advanced Analytics**: Detailed performance metrics
3. **Session Export**: PDF/text export of roleplay sessions
4. **Collaborative Roleplays**: Multi-user roleplay scenarios
5. **AI Feedback**: Performance evaluation and suggestions
6. **Custom Scenarios**: User-generated roleplay scenarios
7. **Voice Integration**: Speech-to-text for more natural interaction

## Testing

To test the roleplay feature:

1. Ensure your OpenRouter API key is configured
2. Start the development server: `npm run dev`
3. Navigate to `/roleplay`
4. Select a category and generate a scenario
5. Test the interactive chat functionality
6. Verify session saving works (currently logs to console)

## Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Verify the key is correctly set in `.env.local`
   - Check OpenRouter account has sufficient credits
   - Ensure the key has proper permissions

2. **Scenario Generation Fails**
   - Check network connectivity
   - Verify OpenRouter API status
   - Review browser console for error messages

3. **Chat Not Responding**
   - Ensure the scenario was generated successfully
   - Check API rate limits
   - Verify the chat API endpoint is accessible

### Error Handling

The application includes comprehensive error handling:
- Network errors are caught and displayed to users
- API failures show user-friendly error messages
- Loading states prevent multiple simultaneous requests
- Fallback scenarios for API failures

## Contributing

When contributing to the roleplay feature:

1. Follow the existing code style and patterns
2. Add proper TypeScript types for new functionality
3. Include error handling for all API calls
4. Test across different screen sizes
5. Update this documentation for new features

## License

This feature is part of the DECA Pal application and follows the same licensing terms.