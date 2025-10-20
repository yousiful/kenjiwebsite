export const microcopy = {
  errors: {
    payment: {
      card_declined: {
        heading: "Card Declined",
        message: "Your bank declined this transaction. This often happens with international cards or fraud protection.",
        actions: [
          "Try a different card",
          "Contact your bank to authorize this charge",
          "Use PayPal as an alternative"
        ],
        support: "Need help? Chat with us now"
      },
      network_error: {
        heading: "Connection Issue",
        message: "We couldn't reach our payment processor. Your card wasn't charged.",
        actions: [
          "Check your internet connection",
          "Try again in 30 seconds",
          "Switch to mobile data if on WiFi"
        ],
        primaryButton: "Retry Payment"
      },
      timeout: {
        heading: "This is Taking Longer Than Expected",
        message: "Don't refresh—we're still processing. This can take up to 2 minutes.",
        showSpinner: true
      },
      browser_outdated: {
        heading: "Browser Update Needed",
        message: "Your browser doesn't support secure payments. Please update to continue safely.",
        primaryButton: "Download Chrome (Free)",
        subtext: "On mobile? Open this page in Safari or Chrome"
      },
      generic: {
        heading: "Payment Couldn't Be Processed",
        message: "Something went wrong on our end. Your card wasn't charged.",
        primaryButton: "Try Again",
        support: "Still stuck? Contact us: care@kenjiai.com or (831) 263-4402"
      }
    },

    form: {
      email_invalid: "Use a valid email like you@company.com",
      email_taken: "This email already has an account. Try logging in instead?",
      email_disposable: "We need a real email to send your access. Try your work email?",
      password_short: "Password needs 8+ characters for security",
      password_weak: "Add a number or symbol to make this stronger",
      password_common: "Too common! Try something unique",
      phone_invalid: "Format: (555) 555-5555 or +1-555-555-5555",
      required_field: "We need this to continue",
      card_invalid: "Card number doesn't look right. Check for typos?",
      cvv_invalid: "CVV is the 3-digit code on back (4 digits for Amex)"
    },

    system: {
      generic: {
        heading: "We Hit a Snag",
        message: "Don't worry—your data is safe. This usually fixes itself in seconds.",
        primaryAction: "Refresh & Continue",
        secondaryAction: "Save Work & Go Home",
        subtext: "Still stuck? Text us at (831) 263-4402 for instant help"
      },
      not_found: {
        heading: "Page Not Found",
        message: "This page doesn't exist, but we have plenty of amazing AI tools to explore!",
        primaryAction: "Go to Dashboard",
        subtext: "We'll redirect you automatically in 10 seconds"
      }
    }
  },

  success: {
    payment: {
      heading: "You're In! Welcome to KenjiAI 🎉",
      message: "Your AI workforce is ready. Check your email for login details.",
      nextSteps: [
        "✓ Payment confirmed",
        "→ Email sent to your inbox",
        "→ Your first AI agent is being set up",
        "→ You'll be closing deals by tonight!"
      ],
      primaryButton: "Open My Dashboard",
      secondaryButton: "Watch Quick Start (3 min)"
    },
    trial_started: {
      heading: "Welcome to KenjiAI!",
      message: "Your AI business system is ready. Let's get you set up for success!",
      quickWins: [
        "5 min: Connect your first tool",
        "15 min: Launch your AI voice agent",
        "1 hour: First automated sale",
        "Day 2: You're a pro!"
      ],
      primaryButton: "Start Setup"
    },
    form_submitted: {
      heading: "Got It! We're On It",
      message: "Someone from our team will reach out in the next 2 hours (usually faster!).",
      estimatedTime: "Response time: Usually under 30 minutes",
      primaryButton: "Explore While You Wait"
    },
    settings_saved: {
      message: "Settings saved!",
      detail: "Your changes are live",
      duration: 3000
    }
  },

  loading: {
    quick: "Just a sec...",
    payment: [
      "Starting Secure Checkout...",
      "Processing Payment...",
      "Almost Done! Setting Up Your Account...",
      "Success! Taking You to Dashboard..."
    ],
    file_upload: {
      preparing: "Preparing your file...",
      uploading: "Uploading... {percent}%",
      processing: "Processing... this might take a minute",
      success: "Done! Your file is ready"
    },
    ai_generation: {
      thinking: "AI is thinking...",
      generating: "Writing your content...",
      optimizing: "Making it perfect...",
      finalizing: "Almost done...",
      complete: "Here's what I created for you!"
    }
  },

  buttons: {
    primary: {
      hero: "Get My AI Employee Now",
      pricing: "Subscribe Now - $275/mo",
      final_cta: "Claim My AI Business System"
    },
    secondary: {
      learn_more: "See How It Works (2 min)",
      free_tools: "Try Free Tools (No Signup)",
      demo: "Watch 30-Second Demo",
      compare: "Compare Plans Side-by-Side"
    },
    actions: {
      reload: "Reload & Fix This",
      go_home: "Back to Dashboard",
      retry: "Retry Payment",
      contact: "Chat with Support",
      cancel: "No Thanks",
      confirm: "Yes, Continue"
    }
  },

  placeholders: {
    email: {
      placeholder: "you@company.com",
      hint: "We'll send your login link here"
    },
    password: {
      placeholder: "Create a strong password",
      hint: "8+ characters, mix of letters & numbers"
    },
    phone: {
      placeholder: "(555) 555-5555",
      hint: "For account recovery & important updates",
      optional: "(Optional—we rarely call)"
    },
    company: {
      placeholder: "Your Business Name",
      hint: "This shows on invoices and emails to customers"
    },
    card_number: {
      placeholder: "1234 5678 9012 3456",
      hint: "We accept all major cards"
    },
    promo_code: {
      placeholder: "SAVE10",
      hint: "Got a discount code? Add it here",
      successMessage: "Nice! You saved $27.50 today"
    }
  },

  confirmations: {
    delete_agent: {
      heading: "Delete '{name}'?",
      consequences: [
        "⚠️ All conversations will be lost",
        "⚠️ Active campaigns will stop",
        "✓ You can create a new agent anytime"
      ],
      primaryButton: "Yes, Delete Forever",
      secondaryButton: "No, Keep It",
      destructive: true
    },
    cancel_subscription: {
      heading: "Cancel Your KenjiAI Plan?",
      whatYouLose: [
        "Access to AI voice agents",
        "Smart workflow automation",
        "24/7 customer support"
      ],
      whatYouKeep: [
        "Your data (we'll keep it for 30 days)",
        "Free tools access",
        "Ability to restart anytime"
      ],
      alternatives: [
        "Pause for 1 month instead?",
        "Switch to basic plan ($99/mo)?",
        "Talk to us—maybe we can help?"
      ],
      primaryButton: "Chat Before I Cancel",
      secondaryButton: "Yes, Cancel Plan"
    },
    unsaved_changes: {
      heading: "You Have Unsaved Changes",
      message: "Your edits will be lost.",
      primaryButton: "Save & Continue",
      secondaryButton: "Discard Changes",
      tertiaryButton: "Keep Editing"
    }
  },

  empty_states: {
    no_results: {
      illustration: "🔍",
      heading: "No Match for '{query}'",
      suggestions: [
        "Check spelling",
        "Try 'voice agents' or 'automation'",
        "Browse all tools instead"
      ],
      actionText: "View All AI Tools"
    },
    no_data: {
      illustration: "📊",
      heading: "Your First Deal is Coming!",
      message: "Once your AI closes deals, you'll see real-time stats here.",
      quickStart: [
        "1. Connect your calendar",
        "2. Set working hours",
        "3. Launch agent"
      ],
      actionText: "Finish Setup (2 min)"
    }
  },

  tooltips: {
    api_key: {
      heading: "API Key (Your Secret Password)",
      explanation: "This lets KenjiAI talk to other apps on your behalf.",
      security: "🔒 We encrypt this and never share it"
    },
    webhook_url: {
      heading: "Webhook (Instant Notifications)",
      explanation: "We'll ping this URL when something happens (like a new lead).",
      plain_english: "Think of it like: 'Call me at this number when you get news'"
    },
    cron_schedule: {
      heading: "Schedule (When This Runs)",
      examples: [
        "Every day at 9 AM",
        "Every Monday at noon",
        "Every hour"
      ]
    }
  },

  notifications: {
    agent_activated: {
      type: "success",
      message: "Your AI Agent is Now Live! 🎉",
      detail: "It's already handling calls. Watch it in action →",
      duration: 5000
    },
    rate_limit: {
      type: "warning",
      message: "Whoa, Slow Down!",
      detail: "You're sending too fast. Wait 60 seconds and try again.",
      countdown: true
    },
    plan_upgraded: {
      type: "celebration",
      message: "Welcome to Pro! 🚀",
      detail: "You now have unlimited AI agents and priority support",
      confetti: true
    },
    payment_failed: {
      type: "error",
      message: "Payment Failed",
      detail: "Your card was declined. Update it to keep your account active.",
      urgent: true,
      dismissible: false
    },
    subscription_reminder: {
      type: "info",
      message: "Complete Your Setup",
      detail: "Finish setting up your account to unlock all features",
      actionText: "Complete Setup"
    }
  }
};

export const getErrorMessage = (errorType: string, context?: Record<string, any>): any => {
  const parts = errorType.split('.');
  let message: any = microcopy.errors;

  for (const part of parts) {
    message = message?.[part];
  }

  if (context && typeof message === 'string') {
    Object.entries(context).forEach(([key, value]) => {
      message = message.replace(`{${key}}`, value);
    });
  }

  return message || microcopy.errors.system.generic;
};

export const getSuccessMessage = (successType: string): any => {
  const parts = successType.split('.');
  let message: any = microcopy.success;

  for (const part of parts) {
    message = message?.[part];
  }

  return message;
};

export const getButtonText = (buttonType: string): string => {
  const parts = buttonType.split('.');
  let text: any = microcopy.buttons;

  for (const part of parts) {
    text = text?.[part];
  }

  return typeof text === 'string' ? text : 'Continue';
};

export const getPlaceholder = (field: string): any => {
  return microcopy.placeholders[field] || { placeholder: '', hint: '' };
};
