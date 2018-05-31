// Ember component - the class is the adblock and css
export default Ember.Component.extend({
    width: 728,
    height: 90,
    
    classNameBindings: ['adUnitClass'],
    classNames: ['codefund-ad'],
    refreshOnChange: null,

    divId: function() {
        if (this.get('postNumber')) {
          return "div-gpt-ad-" + this.get('placement') + '-' + this.get('postNumber');
        } else {
          return "div-gpt-ad-" + this.get('placement');
        }
      }.property('placement', 'postNumber'),
    
      adUnitClass: function() {
        return "codefund-ad-" + this.get("placement");
      }.property('placement'),
    
      adWrapperStyle: function() {
        return `width: ${this.get('width')}px; height: ${this.get('height')}px;`.htmlSafe();
      }.property('width', 'height'),
    
      adTitleStyleMobile: function() {
        return `width: ${this.get('width')}px;`.htmlSafe();
      }.property('width'),
    
      showAd: function() {
        return Discourse.SiteSettings.codefund_publisher_id && this.get('checkTrustLevels');
      }.property('checkTrustLevels'),
    
      checkTrustLevels: function() {
        return !((currentUser) && (currentUser.get('trust_level') > Discourse.SiteSettings.codefund_through_trust_level));
      }.property('trust_level'),
    
      refreshAd: function() {
        var slot = ads[this.get('divId')];
        if (!(slot && slot.ad)) { return; }
    
        var self = this,
            ad = slot.ad;

            // TODO refresh codefund api
    
      }.observes('refreshOnChange'),
    
      _initGoogleDFP: function() {
        if (!this.get('showAd')) { return; }
    
        var self = this;
        console.log(this.siteSettings);
        loadGoogle(this.siteSettings).then(function() {
          self.set('loadedGoogletag', true);
          window.googletag.cmd.push(function() {
            let slot = defineSlot(self.get('divId'), self.get('placement'), self.siteSettings, self.site.mobileView);
            if (slot && slot.ad) {
              slot.ad.setTargeting('discourse-category', self.get('category') ? self.get('category') : '0');
              self.set('width', slot.width);
              self.set('height', slot.height);
              window.googletag.display(self.get('divId'));
              window.googletag.pubads().refresh([slot.ad]);
            }
          });
        });
      }.on('didInsertElement'),
    
      cleanup: function() {
        destroySlot(this.get('divId'));
      }.on('willDestroyElement')
});
