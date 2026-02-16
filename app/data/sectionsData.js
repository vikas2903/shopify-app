// Sections data with liquid code
export const sectionsData = [
  {
    id: "001",
    title: "Announcement Bar",
    image: "https://cdn.shopify.com/s/files/1/0796/7847/2226/files/announcement-bar-removebg-preview.png?v=1754628891",
    description: "Add a customizable announcement bar to your store header.",
    sectionName: "announcement-bar",
    liquidCode: `{% schema %}
{
  "name": "Announcement Bar",
  "settings": [
    {
      "type": "text",
      "id": "message",
      "label": "Message",
      "default": "Free shipping on orders over $50"
    },
    {
      "type": "color",
      "id": "bg_color",
      "label": "Background Color",
      "default": "#000000"
    },
    {
      "type": "color",
      "id": "text_color",
      "label": "Text Color",
      "default": "#ffffff"
    }
  ]
}
{% endschema %}

<div class="announcement-bar" style="background-color: {{ section.settings.bg_color }}; color: {{ section.settings.text_color }}; padding: 12px; text-align: center;">
  <p style="margin: 0;">{{ section.settings.message }}</p>
</div>`
  },
  {
    id: "002",
    title: "Trust Badges",
    image: "https://cdn.shopify.com/s/files/1/0796/7847/2226/files/usp-icons-Photoroom.png?v=1754628535",
    description: "Display trust badges and security icons to build customer confidence.",
    sectionName: "trust-badges",
    liquidCode: `{% schema %}
{
  "name": "Trust Badges",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Why Shop With Us"
    },
    {
      "type": "image_picker",
      "id": "badge_1",
      "label": "Badge 1"
    },
    {
      "type": "text",
      "id": "badge_1_text",
      "label": "Badge 1 Text",
      "default": "Free Shipping"
    },
    {
      "type": "image_picker",
      "id": "badge_2",
      "label": "Badge 2"
    },
    {
      "type": "text",
      "id": "badge_2_text",
      "label": "Badge 2 Text",
      "default": "Secure Payment"
    },
    {
      "type": "image_picker",
      "id": "badge_3",
      "label": "Badge 3"
    },
    {
      "type": "text",
      "id": "badge_3_text",
      "label": "Badge 3 Text",
      "default": "Easy Returns"
    }
  ]
}
{% endschema %}

<div class="trust-badges-section" style="padding: 40px 20px; text-align: center;">
  {% if section.settings.heading != blank %}
    <h2 style="margin-bottom: 30px;">{{ section.settings.heading }}</h2>
  {% endif %}
  <div class="badges-container" style="display: flex; justify-content: center; gap: 40px; flex-wrap: wrap;">
    {% if section.settings.badge_1 != blank %}
      <div class="badge-item">
        <img src="{{ section.settings.badge_1 | image_url: width: 100 }}" alt="{{ section.settings.badge_1_text }}">
        <p>{{ section.settings.badge_1_text }}</p>
      </div>
    {% endif %}
    {% if section.settings.badge_2 != blank %}
      <div class="badge-item">
        <img src="{{ section.settings.badge_2 | image_url: width: 100 }}" alt="{{ section.settings.badge_2_text }}">
        <p>{{ section.settings.badge_2_text }}</p>
      </div>
    {% endif %}
    {% if section.settings.badge_3 != blank %}
      <div class="badge-item">
        <img src="{{ section.settings.badge_3 | image_url: width: 100 }}" alt="{{ section.settings.badge_3_text }}">
        <p>{{ section.settings.badge_3_text }}</p>
      </div>
    {% endif %}
  </div>
</div>`
  },
  {
    id: "003",
    title: "Featured Products",
    image: "https://cdn.shopify.com/s/files/1/0796/7847/2226/files/banner-with-products__1_-removebg-preview.png?v=1755676097",
    description: "Display featured products in an attractive grid layout.",
    sectionName: "featured-products",
    liquidCode: `{% schema %}
{
  "name": "Featured Products",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Featured Products"
    },
    {
      "type": "collection",
      "id": "collection",
      "label": "Collection"
    },
    {
      "type": "range",
      "id": "products_count",
      "label": "Number of Products",
      "min": 4,
      "max": 12,
      "step": 1,
      "default": 8
    }
  ]
}
{% endschema %}

<div class="featured-products-section" style="padding: 40px 20px;">
  {% if section.settings.heading != blank %}
    <h2 style="text-align: center; margin-bottom: 30px;">{{ section.settings.heading }}</h2>
  {% endif %}
  <div class="products-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
    {% assign collection = collections[section.settings.collection] %}
    {% if collection != blank %}
      {% for product in collection.products limit: section.settings.products_count %}
        <div class="product-item">
          <a href="{{ product.url }}">
            <img src="{{ product.featured_image | image_url: width: 300 }}" alt="{{ product.title }}">
            <h3>{{ product.title }}</h3>
            <p>{{ product.price | money }}</p>
          </a>
        </div>
      {% endfor %}
    {% endif %}
  </div>
</div>`
  },
  {
    id: "004",
    title: "Testimonials",
    image: "https://cdn.shopify.com/s/files/1/0796/7847/2226/files/timer-removebg-preview.png?v=1754628533",
    description: "Showcase customer testimonials and reviews.",
    sectionName: "testimonials",
    liquidCode: `{% schema %}
{
  "name": "Testimonials",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "What Our Customers Say"
    }
  ],
  "blocks": [
    {
      "type": "testimonial",
      "name": "Testimonial",
      "settings": [
        {
          "type": "text",
          "id": "customer_name",
          "label": "Customer Name",
          "default": "John Doe"
        },
        {
          "type": "textarea",
          "id": "testimonial_text",
          "label": "Testimonial",
          "default": "Great product! Highly recommended."
        },
        {
          "type": "range",
          "id": "rating",
          "label": "Rating",
          "min": 1,
          "max": 5,
          "step": 1,
          "default": 5
        }
      ]
    }
  ]
}
{% endschema %}

<div class="testimonials-section" style="padding: 40px 20px;">
  {% if section.settings.heading != blank %}
    <h2 style="text-align: center; margin-bottom: 30px;">{{ section.settings.heading }}</h2>
  {% endif %}
  <div class="testimonials-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px;">
    {% for block in section.blocks %}
      <div class="testimonial-item" style="padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div class="rating" style="margin-bottom: 10px;">
          {% for i in (1..block.settings.rating) %}
            ⭐
          {% endfor %}
        </div>
        <p style="font-style: italic; margin-bottom: 15px;">"{{ block.settings.testimonial_text }}"</p>
        <p style="font-weight: bold;">- {{ block.settings.customer_name }}</p>
      </div>
    {% endfor %}
  </div>
</div>`
  }
];
