import { motion } from 'framer-motion';
import './Learning.css';

function Learning() {
  const courses = [
    {
      id: 1,
      title: "Stock Market Course",
      image: "https://placehold.co/600x400/2563eb/white?text=Stock+Market+Course",
      validity: "1 year validity",
      discount: "80% off",
      currentPrice: "₹1000",
      originalPrice: "₹5000"
    },
    {
      id: 2,
      title: "Big Bar Strategy",
      image: "https://placehold.co/600x400/2563eb/white?text=Big+Bar+Strategy",
      validity: "6 months validity",
      discount: "80% off",
      currentPrice: "₹1000",
      originalPrice: "₹5000"
    },
    {
      id: 3,
      title: "Pro Scalping",
      image: "https://placehold.co/600x400/2563eb/white?text=Pro+Scalping",
      validity: "Scalping Techniques",
      discount: "75% off",
      currentPrice: "₹500",
      originalPrice: "₹2000"
    },
    {
      id: 4,
      title: "9-20 Strategy",
      image: "https://placehold.co/600x400/2563eb/white?text=9-20+Strategy",
      validity: "Trading insights",
      discount: "75% off",
      currentPrice: "₹750",
      originalPrice: "₹3000"
    }
  ];

  return (
    <div className="learning-page">
      <motion.h1 
        className="page-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Courses
      </motion.h1>
      <div className="courses-grid">
        {courses.map((course) => (
          <motion.div 
            key={course.id}
            className="course-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="course-image">
              <img src={course.image} alt={course.title} />
              <span className="discount-badge">{course.discount}</span>
            </div>
            <div className="course-content">
              <h3>{course.title}</h3>
              <p className="validity">{course.validity}</p>
              <div className="price-container">
                <span className="current-price">{course.currentPrice}</span>
                <span className="original-price">{course.originalPrice}</span>
              </div>
              <button className="view-details-btn">View Details</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Learning;