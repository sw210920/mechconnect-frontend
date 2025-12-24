# MechConnect - HTML/CSS/JavaScript Version

This is the extracted HTML, CSS, and JavaScript version of the MechConnect web application. The original React/TypeScript project has been converted to vanilla web technologies while maintaining all the functionality and design.

## Files Structure

```
├── index.html          # Main HTML file with all pages
├── styles.css          # Complete CSS styles with animations
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## Features

### Home Page
- **Hero Section**: Animated hero with vehicle selection (car/bike)
- **Features Section**: Why choose MechConnect with animated cards
- **Service Packages**: Three service tiers with dynamic pricing
- **How It Works**: 4-step process explanation
- **Testimonials**: Rotating customer testimonials
- **CTA Section**: Call-to-action with gradient background

### Booking System
- **Multi-step Form**: 4-step booking process with progress indicator
- **Vehicle Selection**: Choose between car and bike
- **Service Packages**: Select from Basic, Standard, or Premium
- **Location Choice**: Doorstep service or garage visit
- **Date & Time**: Interactive calendar and time slot selection
- **Vehicle Details**: Form for vehicle information
- **Contact Info**: Customer contact details
- **Booking Summary**: Review all details before confirmation
- **Confirmation**: Success screen with booking reference

### Interactive Elements
- **Responsive Navigation**: Mobile-friendly header with hamburger menu
- **Smooth Animations**: CSS animations and transitions throughout
- **Form Validation**: Client-side validation with error messages
- **Dynamic Content**: Vehicle-specific pricing and content updates
- **Calendar Widget**: Custom calendar implementation
- **Testimonial Carousel**: Auto-rotating testimonials with manual controls

## How to Use

1. **Open the Website**: Simply open `index.html` in any modern web browser
2. **Navigate**: Use the navigation menu or buttons to move between sections
3. **Book a Service**: Click "Book Now" to start the booking process
4. **Mobile Experience**: The site is fully responsive and works on all devices

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Technical Details

### CSS Features
- **CSS Grid & Flexbox**: Modern layout techniques
- **Custom Animations**: Keyframe animations for smooth interactions
- **CSS Variables**: For consistent theming
- **Responsive Design**: Mobile-first approach with breakpoints
- **Custom Scrollbar**: Styled scrollbars for better UX

### JavaScript Features
- **Vanilla JS**: No external dependencies
- **State Management**: Simple state management for booking flow
- **Event Handling**: Comprehensive event listeners
- **Form Validation**: Client-side validation with feedback
- **Local Storage**: Could be extended to save booking drafts
- **Intersection Observer**: For scroll-triggered animations

### Design System
- **Color Palette**: Blue and purple gradient theme
- **Typography**: Inter font family for modern look
- **Spacing**: Consistent spacing using rem units
- **Components**: Reusable button and card styles
- **Icons**: Font Awesome icons for consistency

## Customization

### Colors
Edit the CSS custom properties in `styles.css`:
```css
:root {
  --primary-blue: #3b82f6;
  --primary-purple: #8b5cf6;
  --gray-600: #6b7280;
  /* Add more variables as needed */
}
```

### Content
- Update text content directly in `index.html`
- Modify service packages in both HTML and JavaScript
- Change testimonials in the HTML structure
- Update contact information in the footer

### Functionality
- Extend booking logic in `script.js`
- Add new validation rules
- Integrate with backend APIs
- Add payment processing

## Performance Optimizations

- **Optimized Images**: Uses optimized external image URLs
- **Minimal Dependencies**: Only Font Awesome for icons
- **Efficient CSS**: Organized and optimized stylesheets
- **Lazy Loading**: Could be added for images
- **Minification**: Files can be minified for production

## Future Enhancements

- **Backend Integration**: Connect to real booking system
- **Payment Gateway**: Add payment processing
- **User Accounts**: Login/registration system
- **Real-time Updates**: WebSocket for live updates
- **PWA Features**: Service worker for offline functionality
- **Analytics**: Google Analytics integration

## License

This is a demonstration project. Modify and use as needed for your projects.