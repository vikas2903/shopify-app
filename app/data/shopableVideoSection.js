// Single section: Shopable Video (no blocks, no theme extension blocks)
export const SHOPABLE_VIDEO_KEY = "shopable-video";

export const shopableVideoSection = {
  id: "shopable-video",
  sectionKey: SHOPABLE_VIDEO_KEY,
  title: "Shopable Video",
  description: "Add a shopable video section to your store. No blocks — settings only.",
  sectionName: "shopable-video",
  image: "https://cdn.shopify.com/s/files/1/0796/7847/2226/files/announcement-bar-removebg-preview.png?v=1754628891",
  liquidCode: `{% comment %}
  Shopable Video section - no blocks, settings only.
  Add to theme via Theme Editor: Add section → Shopable Video.
{% endcomment %}
{% schema %}
{
  "name": "Shopable Video",
  "tag": "section",
  "class": "shopable-video-section",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Watch & Shop"
    },
    {
      "type": "video",
      "id": "video",
      "label": "Video"
    },
    {
      "type": "text",
      "id": "cta_text",
      "label": "Button text",
      "default": "Shop now"
    },
    {
      "type": "url",
      "id": "cta_url",
      "label": "Button link"
    }
  ],
  "presets": [
    {
      "name": "Shopable Video"
    }
  ]
}
{% endschema %}

<div class="shopable-video" style="padding: 40px 20px;">
  {% if section.settings.heading != blank %}
    <h2 class="shopable-video__heading" style="text-align: center; margin-bottom: 24px;">{{ section.settings.heading }}</h2>
  {% endif %}
  {% if section.settings.video != blank %}
    <div class="shopable-video__media" style="max-width: 800px; margin: 0 auto 20px;">
      {{ section.settings.video | video_tag: autoplay: false, controls: true, style: 'width: 100%;' }}
    </div>
  {% endif %}
  {% if section.settings.cta_text != blank %}
    <div class="shopable-video__cta" style="text-align: center;">
      <a href="{{ section.settings.cta_url | default: '#' }}" class="button" style="display: inline-block; padding: 12px 24px; background: #000; color: #fff; text-decoration: none; border-radius: 4px;">{{ section.settings.cta_text }}</a>
    </div>
  {% endif %}
</div>
`,
};
