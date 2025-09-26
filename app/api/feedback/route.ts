import { NextRequest, NextResponse } from 'next/server'
import { aiService, AIAnalysisResult, VoiceAnalysisResult, ImageAnalysisResult } from '@/lib/ai-services'

// Enhanced feedback interface
interface EnhancedFeedback {
  id: number
  userId: string
  userName: string
  location: string
  category: string
  rating: number
  textFeedback?: string
  language: string
  voiceData?: string
  imageData?: string
  emojiRating?: string
  aiAnalysis: AIAnalysisResult
  voiceAnalysis?: VoiceAnalysisResult
  imageAnalysis?: ImageAnalysisResult
  timestamp: string
  isVerified: boolean
  responseFromVendor?: string
  flagged: boolean
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical'
  autoResponseGenerated?: string
  escalated?: boolean
  resolvedAt?: string
  satisfactionFollowUp?: number
}

// Real-time alert system
class AlertSystem {
  static async triggerAlert(feedback: EnhancedFeedback) {
    if (feedback.urgencyLevel === 'critical' || feedback.urgencyLevel === 'high') {
      // In production, this would send real notifications
      console.log(`🚨 CRITICAL ALERT: ${feedback.location} - ${feedback.category}`);
      console.log(`Issue: ${feedback.aiAnalysis.actionableInsights?.join(', ')}`);
      
      // Auto-generate response for critical issues
      feedback.autoResponseGenerated = await this.generateAutoResponse(feedback);
      feedback.escalated = true;
    }
  }

  static async generateAutoResponse(feedback: EnhancedFeedback): Promise<string> {
    const insights = feedback.aiAnalysis.actionableInsights || [];
    
    if (insights.some(i => i.includes('URGENT') || i.includes('Safety'))) {
      return `Thank you for bringing this safety concern to our attention. We have immediately escalated this issue to our safety team and will address it within 24 hours. Your safety is our top priority.`;
    }
    
    if (feedback.aiAnalysis.sentiment === 'negative' && feedback.aiAnalysis.confidence > 0.8) {
      return `We sincerely apologize for your disappointing experience. We have forwarded your feedback to the relevant team for immediate action. We will contact you within 48 hours with an update on the improvements being made.`;
    }
    
    return `Thank you for your valuable feedback. We appreciate you taking the time to share your experience with us.`;
  }
}

// Advanced AI-powered feedback analysis
async function analyzeAdvancedFeedback(
  textFeedback?: string,
  voiceBlob?: Blob,
  imageBlob?: Blob,
  language: string = 'auto'
): Promise<{
  aiAnalysis?: AIAnalysisResult
  voiceAnalysis?: VoiceAnalysisResult
  imageAnalysis?: ImageAnalysisResult
}> {
  try {
    const results: any = {}

    // Analyze text if provided
    if (textFeedback) {
      results.aiAnalysis = await aiService.analyzeText(textFeedback, language)
    }

    // Analyze voice if provided
    if (voiceBlob) {
      results.voiceAnalysis = await aiService.analyzeVoice(voiceBlob)
      
      // If no text feedback, use voice transcription for text analysis
      if (!textFeedback && results.voiceAnalysis.transcription) {
        results.aiAnalysis = await aiService.analyzeText(results.voiceAnalysis.transcription, language)
      }
    }

    // Analyze image if provided
    if (imageBlob) {
      results.imageAnalysis = await aiService.analyzeImage(imageBlob)
    }

    return results
  } catch (error) {
    console.error('Advanced feedback analysis failed:', error)
    
    // Fallback analysis
    if (textFeedback) {
      return {
        aiAnalysis: await aiService.analyzeText(textFeedback, language)
      }
    }
    
    throw error
  }
}

// Real-time sentiment monitoring
class SentimentMonitor {
  private static sentimentHistory: Array<{
    timestamp: string
    sentiment: string
    confidence: number
    location: string
    category: string
  }> = []

  static addSentiment(feedback: EnhancedFeedback) {
    this.sentimentHistory.push({
      timestamp: feedback.timestamp,
      sentiment: feedback.aiAnalysis.sentiment,
      confidence: feedback.aiAnalysis.confidence,
      location: feedback.location,
      category: feedback.category
    })

    // Keep only last 1000 entries
    if (this.sentimentHistory.length > 1000) {
      this.sentimentHistory = this.sentimentHistory.slice(-1000)
    }

    // Check for sentiment trends
    this.checkSentimentTrends(feedback.location, feedback.category)
  }

  static checkSentimentTrends(location: string, category: string) {
    const recentFeedbacks = this.sentimentHistory
      .filter(s => s.location === location && s.category === category)
      .slice(-10) // Last 10 feedbacks for this location/category

    if (recentFeedbacks.length >= 5) {
      const negativeFeedbacks = recentFeedbacks.filter(s => s.sentiment === 'negative')
      
      if (negativeFeedbacks.length >= 3) {
        console.log(`⚠️ TREND ALERT: Increasing negative sentiment detected for ${location} - ${category}`)
        // In production, this would trigger notifications to tourism officials
      }
    }
  }

  static getSentimentTrends(location?: string, category?: string) {
    let filtered = this.sentimentHistory
    
    if (location) {
      filtered = filtered.filter(s => s.location === location)
    }
    
    if (category) {
      filtered = filtered.filter(s => s.category === category)
    }
    
    return filtered.slice(-30) // Last 30 entries
  }
}

// AI-powered chatbot for instant responses
class FeedbackChatbot {
  static async generateResponse(feedback: EnhancedFeedback): Promise<string> {
    const { aiAnalysis, location, category } = feedback
    
    // Generate contextual response based on AI analysis
    if (aiAnalysis.urgency === 'critical') {
      return `Thank you for this critical feedback about ${location}. We are immediately addressing the ${aiAnalysis.categories?.join(', ')} issues you've mentioned. A senior official will contact you within 2 hours.`
    }
    
    if (aiAnalysis.sentiment === 'positive') {
      return `We're delighted to hear about your positive experience at ${location}! Thank you for highlighting ${aiAnalysis.keywords.slice(0, 3).join(', ')}. We'll share your feedback with our team.`
    }
    
    if (aiAnalysis.sentiment === 'negative') {
      const issues = aiAnalysis.actionableInsights?.slice(0, 2).join(' and ') || 'the issues you mentioned'
      return `We sincerely apologize for your experience at ${location}. We're taking immediate action on ${issues}. You can expect an update within 24-48 hours.`
    }
    
    return `Thank you for your feedback about ${location}. Your insights about ${category.toLowerCase()} are valuable for improving our tourism services.`
  }
  
  static async generateFollowUpQuestions(feedback: EnhancedFeedback): Promise<string[]> {
    const questions: string[] = []
    
    if (feedback.aiAnalysis.sentiment === 'negative') {
      questions.push('What specific steps would you like to see implemented to improve this experience?')
      questions.push('Would you be willing to revisit this location if improvements were made?')
    }
    
    if (feedback.aiAnalysis.categories?.includes('service quality')) {
      questions.push('Can you provide more details about the staff interaction?')
    }
    
    if (feedback.aiAnalysis.categories?.includes('cleanliness')) {
      questions.push('Which specific areas need attention regarding cleanliness?')
    }
    
    return questions.slice(0, 3)
  }
}

// Fallback rule-based sentiment analysis
function fallbackSentimentAnalysis(text: string, language: string): {
  sentiment: 'positive' | 'negative' | 'neutral'
  confidence: number
  emotions: { [key: string]: number }
  keywords: string[]
} {
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'beautiful', 'love', 'perfect', 'awesome', 'fantastic']
  const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'hate', 'worst', 'disappointing', 'poor', 'dirty', 'unsafe']
  
  // Hindi positive/negative words
  const hindiPositive = ['अच्छा', 'बहुत', 'सुंदर', 'खुश', 'प्रसन्न', 'उत्कृष्ट']
  const hindiNegative = ['बुरा', 'गंदा', 'खराब', 'दुखी', 'निराश']

  const words = text.toLowerCase().split(/\s+/)
  let positiveCount = 0
  let negativeCount = 0
  let keywords: string[] = []

  words.forEach(word => {
    if (positiveWords.includes(word) || hindiPositive.includes(word)) {
      positiveCount++
      keywords.push(word)
    }
    if (negativeWords.includes(word) || hindiNegative.includes(word)) {
      negativeCount++
      keywords.push(word)
    }
  })

  let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral'
  let confidence = 0.5

  if (positiveCount > negativeCount) {
    sentiment = 'positive'
    confidence = Math.min(0.9, 0.5 + (positiveCount - negativeCount) * 0.1)
  } else if (negativeCount > positiveCount) {
    sentiment = 'negative'
    confidence = Math.min(0.9, 0.5 + (negativeCount - positiveCount) * 0.1)
  }

  const emotions = {
    joy: sentiment === 'positive' ? confidence * 0.8 : 0.1,
    anger: sentiment === 'negative' ? confidence * 0.6 : 0.1,
    sadness: sentiment === 'negative' ? confidence * 0.4 : 0.1,
    surprise: 0.2,
    fear: sentiment === 'negative' ? confidence * 0.3 : 0.05,
    disgust: sentiment === 'negative' ? confidence * 0.2 : 0.05
  }

  return {
    sentiment,
    confidence,
    emotions,
    keywords: keywords.slice(0, 5)
  }
}

// Enhanced analysis functions
function enhanceAnalysisWithRatings(aiAnalysis: AIAnalysisResult, starRating: number, emojiRating?: string): AIAnalysisResult {
  // Prioritize AI text analysis, use ratings as enhancement/validation
  let enhancedSentiment = aiAnalysis.sentiment
  let enhancedConfidence = aiAnalysis.confidence
  let enhancedUrgency = aiAnalysis.urgency || 'low'

  console.log('🔍 Original AI Analysis:', {
    sentiment: aiAnalysis.sentiment,
    confidence: aiAnalysis.confidence,
    starRating,
    emojiRating
  })

  // If AI analysis has high confidence, trust it more than ratings
  if (aiAnalysis.confidence > 0.7) {
    console.log('✅ High confidence AI analysis - using text sentiment as primary')
    
    // Only adjust urgency based on star rating if text analysis suggests negative sentiment
    if (aiAnalysis.sentiment === 'negative') {
      if (starRating <= 2) {
        enhancedUrgency = starRating === 1 ? 'high' : 'medium'
      }
    }
    
    // Emoji can reinforce the text analysis
    if (emojiRating) {
      const emojiSentimentMap: { [key: string]: { sentiment: 'positive' | 'negative' | 'neutral', urgency: 'low' | 'medium' | 'high' | 'critical' } } = {
        '😍': { sentiment: 'positive', urgency: 'low' },
        '😊': { sentiment: 'positive', urgency: 'low' },
        '😐': { sentiment: 'neutral', urgency: 'low' },
        '😞': { sentiment: 'negative', urgency: 'medium' },
        '😡': { sentiment: 'negative', urgency: 'high' }
      }
      
      const emojiData = emojiSentimentMap[emojiRating]
      if (emojiData && emojiData.sentiment === aiAnalysis.sentiment) {
        // Emoji reinforces text analysis - increase confidence
        enhancedConfidence = Math.min(0.95, enhancedConfidence + 0.1)
        console.log('🎯 Emoji reinforces text analysis - confidence boosted')
      } else if (emojiData && emojiData.sentiment !== aiAnalysis.sentiment) {
        // Emoji conflicts with text - average them out
        console.log('⚖️ Emoji conflicts with text analysis - balancing')
        enhancedConfidence = Math.max(0.6, enhancedConfidence - 0.1)
      }
    }
  } else {
    // Low confidence AI analysis - use ratings to help determine sentiment
    console.log('⚠️ Low confidence AI analysis - using ratings to enhance')
    
    // Create weighted sentiment based on text + stars + emoji
    let textWeight = aiAnalysis.confidence // 0.0 to 1.0
    let starWeight = 0.4 // Fixed weight for star rating
    let emojiWeight = emojiRating ? 0.3 : 0
    
    // Normalize weights
    let totalWeight = textWeight + starWeight + emojiWeight
    textWeight = textWeight / totalWeight
    starWeight = starWeight / totalWeight
    emojiWeight = emojiWeight / totalWeight
    
    console.log('📊 Sentiment weights:', { textWeight, starWeight, emojiWeight })
    
    // Calculate sentiment scores
    let positiveScore = 0
    let negativeScore = 0
    let neutralScore = 0
    
    // Text contribution
    if (aiAnalysis.sentiment === 'positive') positiveScore += textWeight
    else if (aiAnalysis.sentiment === 'negative') negativeScore += textWeight
    else neutralScore += textWeight
    
    // Star rating contribution
    if (starRating >= 4) positiveScore += starWeight
    else if (starRating <= 2) negativeScore += starWeight
    else neutralScore += starWeight
    
    // Emoji contribution
    if (emojiRating) {
      if (emojiRating === '😍' || emojiRating === '😊') positiveScore += emojiWeight
      else if (emojiRating === '😞' || emojiRating === '😡') negativeScore += emojiWeight
      else neutralScore += emojiWeight
    }
    
    // Determine final sentiment
    if (positiveScore > negativeScore && positiveScore > neutralScore) {
      enhancedSentiment = 'positive'
      enhancedConfidence = 0.6 + (positiveScore * 0.3)
      enhancedUrgency = 'low'
    } else if (negativeScore > positiveScore && negativeScore > neutralScore) {
      enhancedSentiment = 'negative'
      enhancedConfidence = 0.6 + (negativeScore * 0.3)
      enhancedUrgency = starRating <= 2 ? (starRating === 1 ? 'high' : 'medium') : 'medium'
    } else {
      enhancedSentiment = 'neutral'
      enhancedConfidence = 0.6 + (neutralScore * 0.2)
      enhancedUrgency = 'low'
    }
    
    console.log('📈 Sentiment scores:', { positiveScore, negativeScore, neutralScore })
  }

  console.log('✅ Final enhanced analysis:', {
    sentiment: enhancedSentiment,
    confidence: enhancedConfidence,
    urgency: enhancedUrgency
  })

  return {
    ...aiAnalysis,
    sentiment: enhancedSentiment,
    confidence: enhancedConfidence,
    urgency: enhancedUrgency
  }
}

function createFallbackAnalysis(text: string, starRating: number, emojiRating?: string, language?: string): AIAnalysisResult {
  console.log('🔄 Creating fallback analysis for:', { text: text.substring(0, 50) + '...', starRating, emojiRating })
  
  // Enhanced text analysis
  let textSentiment: 'positive' | 'negative' | 'neutral' = 'neutral'
  let textConfidence = 0.5
  
  if (text && text.trim().length > 0) {
    // Enhanced word lists for better accuracy
    const positiveWords = [
      'good', 'great', 'excellent', 'amazing', 'wonderful', 'beautiful', 'love', 'perfect', 
      'awesome', 'fantastic', 'outstanding', 'superb', 'brilliant', 'magnificent', 'marvelous',
      'delightful', 'pleasant', 'enjoyable', 'satisfying', 'impressive', 'remarkable', 'splendid',
      'clean', 'friendly', 'helpful', 'comfortable', 'peaceful', 'relaxing', 'refreshing',
      'nice', 'lovely', 'charming', 'stunning', 'breathtaking', 'incredible', 'fabulous',
      // Hindi positive words
      'अच्छा', 'बहुत', 'सुंदर', 'खुश', 'प्रसन्न', 'उत्कृष्ट', 'शानदार', 'बेहतरीन', 'मजेदार'
    ]
    
    const negativeWords = [
      'bad', 'terrible', 'awful', 'horrible', 'hate', 'worst', 'disappointing', 'poor',
      'disgusting', 'pathetic', 'useless', 'worthless', 'annoying', 'frustrating', 'boring',
      'unpleasant', 'uncomfortable', 'dirty', 'smelly', 'noisy', 'crowded', 'expensive',
      'overpriced', 'rude', 'unfriendly', 'unhelpful', 'slow', 'delayed', 'cancelled',
      'broken', 'damaged', 'unsafe', 'dangerous', 'scary', 'unsatisfactory', 'disappointing',
      // Hindi negative words
      'बुरा', 'गंदा', 'खराब', 'दुखी', 'निराश', 'भयानक', 'घटिया', 'बेकार', 'महंगा'
    ]
    
    const words = text.toLowerCase().split(/\s+/)
    let positiveCount = 0
    let negativeCount = 0
    
    words.forEach(word => {
      if (positiveWords.includes(word)) positiveCount++
      if (negativeWords.includes(word)) negativeCount++
    })
    
    // Determine text sentiment
    if (positiveCount > negativeCount) {
      textSentiment = 'positive'
      textConfidence = Math.min(0.85, 0.6 + (positiveCount - negativeCount) * 0.1)
    } else if (negativeCount > positiveCount) {
      textSentiment = 'negative'
      textConfidence = Math.min(0.85, 0.6 + (negativeCount - positiveCount) * 0.1)
    } else if (positiveCount === negativeCount && positiveCount > 0) {
      textSentiment = 'neutral'
      textConfidence = 0.7
    }
    
    console.log('📝 Text analysis:', { textSentiment, textConfidence, positiveCount, negativeCount })
  }
  
  // Combine text analysis with ratings using weighted approach
  let finalSentiment: 'positive' | 'negative' | 'neutral' = 'neutral'
  let finalConfidence = 0.5
  let urgency: 'low' | 'medium' | 'high' | 'critical' = 'low'
  
  // Weight distribution: Text (50%), Stars (30%), Emoji (20%)
  let textWeight = text && text.trim().length > 0 ? 0.5 : 0
  let starWeight = 0.3 + (textWeight === 0 ? 0.5 : 0) // Increase star weight if no text
  let emojiWeight = emojiRating ? 0.2 : 0
  
  // Normalize weights
  let totalWeight = textWeight + starWeight + emojiWeight
  if (totalWeight > 0) {
    textWeight = textWeight / totalWeight
    starWeight = starWeight / totalWeight
    emojiWeight = emojiWeight / totalWeight
  }
  
  console.log('⚖️ Analysis weights:', { textWeight, starWeight, emojiWeight })
  
  // Calculate sentiment scores
  let positiveScore = 0
  let negativeScore = 0
  let neutralScore = 0
  
  // Text contribution
  if (textSentiment === 'positive') positiveScore += textWeight * textConfidence
  else if (textSentiment === 'negative') negativeScore += textWeight * textConfidence
  else neutralScore += textWeight * (textConfidence || 0.5)
  
  // Star rating contribution
  if (starRating >= 4) positiveScore += starWeight
  else if (starRating <= 2) negativeScore += starWeight
  else neutralScore += starWeight
  
  // Emoji contribution
  if (emojiRating) {
    if (emojiRating === '😍' || emojiRating === '😊') positiveScore += emojiWeight
    else if (emojiRating === '😞' || emojiRating === '😡') negativeScore += emojiWeight
    else neutralScore += emojiWeight
  }
  
  // Determine final sentiment
  if (positiveScore > negativeScore && positiveScore > neutralScore) {
    finalSentiment = 'positive'
    finalConfidence = Math.min(0.9, 0.6 + positiveScore * 0.4)
    urgency = 'low'
  } else if (negativeScore > positiveScore && negativeScore > neutralScore) {
    finalSentiment = 'negative'
    finalConfidence = Math.min(0.9, 0.6 + negativeScore * 0.4)
    urgency = starRating <= 2 ? (starRating === 1 ? 'high' : 'medium') : 'medium'
    if (emojiRating === '😡') urgency = 'high'
  } else {
    finalSentiment = 'neutral'
    finalConfidence = Math.min(0.8, 0.6 + neutralScore * 0.3)
    urgency = 'low'
  }
  
  // Extract keywords and categories
  const keywords: string[] = []
  const categories: string[] = []
  const actionableInsights: string[] = []

  if (text) {
    const lowercaseText = text.toLowerCase()
    
    // Extract meaningful keywords
    const words = text.split(/\s+/).filter(word => word.length > 3 && !['this', 'that', 'with', 'have', 'been', 'were', 'they', 'there'].includes(word.toLowerCase()))
    keywords.push(...words.slice(0, 5))

    // Categorize based on content
    if (lowercaseText.includes('room') || lowercaseText.includes('stay') || lowercaseText.includes('hotel') || lowercaseText.includes('accommodation')) categories.push('accommodation')
    if (lowercaseText.includes('food') || lowercaseText.includes('meal') || lowercaseText.includes('restaurant') || lowercaseText.includes('eat')) categories.push('food')
    if (lowercaseText.includes('staff') || lowercaseText.includes('service') || lowercaseText.includes('help') || lowercaseText.includes('support')) categories.push('service quality')
    if (lowercaseText.includes('clean') || lowercaseText.includes('dirty') || lowercaseText.includes('hygiene') || lowercaseText.includes('maintenance')) categories.push('cleanliness')
    if (lowercaseText.includes('price') || lowercaseText.includes('cost') || lowercaseText.includes('expensive') || lowercaseText.includes('cheap') || lowercaseText.includes('money')) categories.push('pricing')
    if (lowercaseText.includes('location') || lowercaseText.includes('place') || lowercaseText.includes('area') || lowercaseText.includes('destination')) categories.push('location')

    // Generate actionable insights based on sentiment and content
    if (finalSentiment === 'negative') {
      actionableInsights.push('Immediate attention required for customer satisfaction')
      if (starRating === 1) actionableInsights.push('Critical service improvement needed')
      if (categories.includes('cleanliness')) actionableInsights.push('Focus on hygiene and cleanliness standards')
      if (categories.includes('service quality')) actionableInsights.push('Staff training and customer service improvement required')
      if (categories.includes('pricing')) actionableInsights.push('Review pricing strategy and value proposition')
    } else if (finalSentiment === 'positive') {
      actionableInsights.push('Leverage positive feedback for marketing and testimonials')
      if (categories.includes('service quality')) actionableInsights.push('Recognize and reward excellent staff performance')
    }
  }

  console.log(`✅ Enhanced fallback analysis: ${finalSentiment} (${finalConfidence.toFixed(2)} confidence) - Scores: P:${positiveScore.toFixed(2)} N:${negativeScore.toFixed(2)} Neu:${neutralScore.toFixed(2)}`)

  return {
    sentiment: finalSentiment,
    confidence: finalConfidence,
    emotions: {
      joy: finalSentiment === 'positive' ? finalConfidence * 0.8 : 0.1,
      anger: finalSentiment === 'negative' ? finalConfidence * 0.7 : 0.1,
      sadness: finalSentiment === 'negative' ? finalConfidence * 0.5 : 0.1,
      surprise: 0.2,
      fear: urgency === 'high' ? 0.6 : 0.1,
      disgust: finalSentiment === 'negative' ? finalConfidence * 0.4 : 0.1
    },
    keywords,
    language: language || 'en',
    toxicity: urgency === 'high' ? 0.6 : 0,
    urgency,
    categories,
    actionableInsights
  }
}

// Enhanced feedback database with AI analysis
let feedbacks: EnhancedFeedback[] = []

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const location = searchParams.get('location')
    const category = searchParams.get('category')
    const sentiment = searchParams.get('sentiment')
    const flagged = searchParams.get('flagged')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let filteredFeedbacks = [...feedbacks]

    if (location && location !== 'All') {
      filteredFeedbacks = filteredFeedbacks.filter(f => f.location === location)
    }

    if (category && category !== 'All') {
      filteredFeedbacks = filteredFeedbacks.filter(f => f.category === category)
    }

    if (sentiment && sentiment !== 'All') {
      filteredFeedbacks = filteredFeedbacks.filter(f => f.aiAnalysis.sentiment === sentiment)
    }

    if (flagged === 'true') {
      filteredFeedbacks = filteredFeedbacks.filter(f => f.flagged)
    }

    // Sort by timestamp (newest first)
    filteredFeedbacks.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    const paginatedFeedbacks = filteredFeedbacks.slice(offset, offset + limit)

    // Calculate sentiment statistics (simplified - no urgency levels)
    const sentimentStats = {
      positive: filteredFeedbacks.filter(f => f.aiAnalysis.sentiment === 'positive').length,
      negative: filteredFeedbacks.filter(f => f.aiAnalysis.sentiment === 'negative').length,
      neutral: filteredFeedbacks.filter(f => f.aiAnalysis.sentiment === 'neutral').length,
      total: filteredFeedbacks.length
    }

    // Get sentiment trends
    const sentimentTrends = SentimentMonitor.getSentimentTrends(location || undefined, category || undefined)

    return NextResponse.json({
      feedbacks: paginatedFeedbacks,
      total: filteredFeedbacks.length,
      sentimentStats,
      sentimentTrends,
      hasMore: offset + limit < filteredFeedbacks.length
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch feedback' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, userName, location, category, rating, textFeedback, language = 'auto', voiceData, imageData, emojiRating } = body

    // Enhanced AI analysis with star rating and emoji integration
    let aiAnalysis: AIAnalysisResult
    let voiceAnalysis: VoiceAnalysisResult | undefined
    let imageAnalysis: ImageAnalysisResult | undefined

    try {
      // Convert base64 data to blobs if provided
      const voiceBlob = voiceData ? new Blob([Buffer.from(voiceData, 'base64')], { type: 'audio/wav' }) : undefined
      const imageBlob = imageData ? new Blob([Buffer.from(imageData, 'base64')], { type: 'image/jpeg' }) : undefined

      const analysisResults = await analyzeAdvancedFeedback(textFeedback, voiceBlob, imageBlob, language)
      aiAnalysis = analysisResults.aiAnalysis!
      voiceAnalysis = analysisResults.voiceAnalysis
      imageAnalysis = analysisResults.imageAnalysis

      // Enhance analysis with star rating and emoji data
      aiAnalysis = enhanceAnalysisWithRatings(aiAnalysis, rating, emojiRating)
      
      console.log('✅ Enhanced AI analysis complete:', {
        sentiment: aiAnalysis.sentiment,
        confidence: aiAnalysis.confidence,
        urgency: aiAnalysis.urgency,
        starRating: rating,
        emoji: emojiRating
      })
      
    } catch (error) {
      console.error('AI analysis failed, using enhanced fallback:', error)
      // Enhanced fallback analysis with star rating and emoji
      aiAnalysis = createFallbackAnalysis(textFeedback || '', rating, emojiRating, language)
    }

    // Determine urgency level
    const urgencyLevel = aiAnalysis.urgency || 'low'

    // Check for flagging conditions
    const flagged = (aiAnalysis.sentiment === 'negative' && aiAnalysis.confidence > 0.7) ||
                   (aiAnalysis.toxicity && aiAnalysis.toxicity > 0.5) ||
                   urgencyLevel === 'critical' || urgencyLevel === 'high'

    const newFeedback: EnhancedFeedback = {
      id: feedbacks.length + 1,
      userId,
      userName,
      location,
      category,
      rating,
      textFeedback,
      language: aiAnalysis.language,
      voiceData,
      imageData,
      emojiRating,
      aiAnalysis,
      voiceAnalysis,
      imageAnalysis,
      timestamp: new Date().toISOString(),
      isVerified: false,
      responseFromVendor: undefined,
      flagged,
      urgencyLevel
    }

    // Generate auto-response using AI chatbot
    try {
      newFeedback.autoResponseGenerated = await FeedbackChatbot.generateResponse(newFeedback)
    } catch (error) {
      console.error('Auto-response generation failed:', error)
    }

    feedbacks.push(newFeedback)

    // Add to sentiment monitoring
    SentimentMonitor.addSentiment(newFeedback)

    // Trigger alerts for critical issues
    await AlertSystem.triggerAlert(newFeedback)

    return NextResponse.json({
      ...newFeedback,
      followUpQuestions: await FeedbackChatbot.generateFollowUpQuestions(newFeedback)
    }, { status: 201 })
  } catch (error) {
    console.error('Failed to submit feedback:', error)
    return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { feedbackId, responseFromVendor, flagged } = body

    const feedbackIndex = feedbacks.findIndex(f => f.id === feedbackId)
    if (feedbackIndex === -1) {
      return NextResponse.json({ error: 'Feedback not found' }, { status: 404 })
    }

    feedbacks[feedbackIndex] = {
      ...feedbacks[feedbackIndex],
      ...(responseFromVendor && { responseFromVendor }),
      ...(typeof flagged === 'boolean' && { flagged }),
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json(feedbacks[feedbackIndex])
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update feedback' }, { status: 500 })
  }
}
