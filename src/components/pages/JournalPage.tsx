'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, User } from 'lucide-react'
import Hero from '../Hero'

export default function JournalPage() {
  const articles = [
    {
      title: 'The Power of Mind-Body Connection',
      excerpt: 'Discover how pilates strengthens the connection between your mind and body for lasting transformation.',
      image: '/images/journal-mindfulness.jpg',
      author: 'Sarah Mitchell',
      date: '2024-05-10',
      category: 'Wellness',
      readTime: '5 min read',
    },
    {
      title: 'Pilates for Better Posture',
      excerpt: 'Learn how regular pilates practice can improve your posture and reduce back pain.',
      image: '/images/journal-posture.jpg',
      author: 'Emma Rodriguez',
      date: '2024-05-08',
      category: 'Health',
      readTime: '7 min read',
    },
    {
      title: 'Beginner\'s Guide to Reformer Pilates',
      excerpt: 'Everything you need to know before stepping on a reformer for the first time.',
      image: '/images/journal-beginner.jpg',
      author: 'James Chen',
      date: '2024-05-05',
      category: 'Tutorial',
      readTime: '6 min read',
    },
    {
      title: 'Core Strength: More Than Just Abs',
      excerpt: 'Understand what true core strength means and how pilates builds a functional core.',
      image: '/images/journal-core.jpg',
      author: 'Lisa Anderson',
      date: '2024-05-01',
      category: 'Fitness',
      readTime: '8 min read',
    },
    {
      title: 'Pilates and Athletic Performance',
      excerpt: 'Explore how athletes integrate pilates into their training routines.',
      image: '/images/journal-athletic.jpg',
      author: 'Marcus Thompson',
      date: '2024-04-28',
      category: 'Performance',
      readTime: '6 min read',
    },
    {
      title: 'Breathing Techniques for Pilates',
      excerpt: 'Master the art of breathing in pilates to maximize your practice.',
      image: '/images/journal-breathing.jpg',
      author: 'Elena Rossi',
      date: '2024-04-25',
      category: 'Technique',
      readTime: '5 min read',
    },
  ]

  const categories = [
    'All',
    'Wellness',
    'Health',
    'Fitness',
    'Technique',
    'Tutorial',
  ]

  return (
    <div className="w-full">
      {/* Hero Section */}
      <Hero
        title="Sculpt LAB Journal"
        subtitle="Insights, tips, and stories from our community"
        imageSrc="/images/hero-journal.jpg"
        imageAlt="Journal and wellness content"
      />

      {/* Featured Article */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center glassmorphism overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative h-80 md:h-[450px]"
            >
              <Image
                src={articles[0].image}
                alt={articles[0].title}
                fill
                className="object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-6 md:p-8"
            >
              <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full mb-4">
                Featured
              </div>
              <h2 className="font-serif text-3xl font-medium text-primary mb-4">
                {articles[0].title}
              </h2>
              <p className="body-text text-foreground/80 mb-6">
                {articles[0].excerpt}
              </p>
              <div className="flex flex-wrap gap-4 mb-6 text-sm text-foreground/60">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {articles[0].author}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(articles[0].date).toLocaleDateString()}
                </div>
                <span>{articles[0].readTime}</span>
              </div>
              <Link
                href="#"
                className="inline-flex items-center text-primary hover:text-primary/70 transition-colors font-medium"
              >
                Read Article
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-3 justify-center md:justify-start"
          >
            {categories.map((category) => (
              <button
                key={category}
                className={`px-6 py-2 rounded-full font-medium text-sm transition-colors ${
                  category === 'All'
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-primary text-primary hover:bg-primary/5'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {articles.slice(1).map((article, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="group glassmorphism overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm text-primary text-xs font-medium rounded-full">
                      {article.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-serif text-xl font-medium text-primary mb-3 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="body-text text-sm text-foreground/70 mb-4 line-clamp-2">
                    {article.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-3 text-xs text-foreground/60 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {article.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(article.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </div>

                  <Link
                    href="#"
                    className="inline-flex items-center text-primary hover:text-primary/70 transition-colors text-sm font-medium group/link"
                  >
                    Read More
                    <ArrowRight className="w-3 h-3 ml-2 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="section-title text-primary mb-4">
              Stay Updated
            </h2>
            <p className="body-text text-lg text-foreground/70 mb-8">
              Subscribe to our newsletter for wellness tips and exclusive content
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
