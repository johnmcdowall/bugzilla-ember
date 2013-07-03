import 'bugzilla/utils/get_json' as getJSON;
import 'bugzilla/utils/url_for' as urlFor;

var attr = Ember.attr;

var Attachment = Ember.Model.extend({
  id: attr(),
  bug_id: attr(),
  description: attr(),
  file_name: attr(),
  size: attr(),
  is_obsolete: attr(),
  is_patch: attr(),
  attacher: attr(),
  flags: attr(),
  last_change_time: attr(),

  decodedData: function() {
    var encodedData = this.get('data.data');
    if (encodedData) { return atob(encodedData); }
  }.property('data', 'data.data'),

  // FIXME: These belong in an itemController
  reviewURL: function() {
    var id = this.get('id'),
        bugId = this.get('bug_id');

    return "https://bugzilla.mozilla.org/page.cgi?id=splinter.html&bug=%@&attachment=%@".fmt(bugId, id);
  }.property('id', 'bug_id'),

  diffURL: function() {
    var id = this.get('id'),
        bugId = this.get('bugId');

    return "https://bugzilla.mozilla.org/attachment.cgi?id=%@&action=diff".fmt(id);
  }.property('id', 'bug_id'),
});

Attachment.reopenClass({
  adapter: Ember.Adapter.create({
    find: function(record, id) {
      var url = urlFor("attachment/%@?attachmentdata=1".fmt(id));

      getJSON(url).then(function(data) {
        record.load(id, data);
      });
    }
  })
});

export = Attachment;
