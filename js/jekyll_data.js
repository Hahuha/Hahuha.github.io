---
---

(function(window) {
    'use strict';

    function define() {
        var jdata = {};
        var d = {
            title: '{{ site.title }}',
            url: '{{ site.url + site.baseurl }}',
            collections: [
              {% for c in site.collections %}
                {
                  id: '{{ c.collection }}',
                  title: '{{ c.title | capitalize }}',
                  path: '{{ c.collection }}',
                  data: []
              } {% if forloop.last %} {% else %}, {% endif %}
              {% endfor %}
            ]
        };

        jdata.title = function() {
            return d.title;
        };

        jdata.url = function() {
            return d.url;
        };

        jdata.collections = function() {
            return d.collections;
        };

        jdata.collectionById = function(p_Id) {
            try {
                return _.findWhere(d.collections, {
                    id: p_Id
                });
            } catch (e) {
                console.error('Error getting collection with id. Exception : ' + e);
                return null;
            }
        };

        jdata.setCollectionData = function(collectionId, p_data) {
            try {
                var index = _.findIndex(d.collections, {id : collectionId});
                d.collections[index].data = p_data;
                return true;
            } catch (e) {
                console.error('Error adding data to collection. Exception : ' + e);
                return false;
            }
        };

        jdata.collectionDataById = function(collectionId, dataId) {
            try {
                var c = this.collectionById(collectionId);
                return _.findWhere(c.data, {
                    id: dataId
                });
            } catch (e) {
                console.error('Error getting collection data. Exception : ' + e);
                return null;
            }
        };

        jdata.nextCollectionData = function(collectionId, dataId) {
            try {
                var data = this.collectionDataById(collectionId, dataId);
                var index = _.findIndex(data, {id : dataId});
                return data[index + 1];
            } catch (e) {
                console.error('Error getting next collection data. Exception : ' + e);
                return null;
            }
        };

        jdata.previousCollectionData = function(collectionId, dataId) {
            try {
                var data = this.collectionDataById(collectionId, dataId);
                var index = _.findIndex(data, {id : dataId});
                return data[index - 1];
            } catch (e) {
                console.error('Error getting previous collection data. Exception : ' + e);
                return null;
            }
        };

        jdata.isCollectionDataFirst = function (collectionId, dataId) {
          try {
              var data = this.collectionDataById(collectionId, dataId);
              var index = _.findIndex(data, {id : dataId});
              return index == 0;
          } catch (e) {
              console.error('Error getting previous collection data. Exception : ' + e);
              return undefined;
          }
        };

        jdata.isCollectionDataLast = function (collectionId, dataId) {
          try {
              var data = this.collectionDataById(collectionId, dataId);
              var index = _.findIndex(data, {id : dataId});
              return index == data.length - 1;
          } catch (e) {
              console.error('Error getting previous collection data. Exception : ' + e);
              return undefined;
          }
        };

        return jdata;
    };

    if (typeof(jdata) === 'undefined') {
        window.jdata = define();
    } else {
        console.error("jdata is already defined.");
    }
})(window);
