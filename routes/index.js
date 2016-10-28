var express = require('express');
var dbUtils = require('../utils/dbUtils');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
    var no = req.query.p;
    no = !!no && Number(no) > 0 ? Number(no) : 1;
    var params = {
        body: {
            weibo: 1
        },
        page: {
            no: no,
            size: 10
        }
    };
    dbUtils.getCount('bing', params.body, function(r) {
        var sum = r[0]['sum'] || 0;
        var size = params.page.size;
        if (sum > 0) {
            var page = {
                size: size,
                no: no > Math.ceil(sum / size) ? Math.ceil(sum / size) : no,
                sum: sum,
                next: no + 1 > Math.ceil(sum / size) ? Math.ceil(sum / size) : no + 1,
                prev: no - 1 >= 0 ? ((no - 1) > Math.ceil(sum / size) ? Math.ceil(sum / size) - 1 : no - 1) : 1
            };
            params['page'] = page;
            dbUtils.get('bing', params, function(rows) {
                if (rows.length > 0) {
                    var data = [];
                    for (var i in rows) {
                        var date = rows[i]['enddate'];
                        var y = date.substr(0, 4);
                        var m = date.substr(4, 2);
                        var d = date.substr(6, 2);
                        var full = y + '-' + m + '-' + d;
                        data.push({
                            id: rows[i]['id'],
                            title: rows[i]['title'],
                            attribute: rows[i]['attribute'],
                            description: rows[i]['description'],
                            startdate: rows[i]['startdate'],
                            enddate: rows[i]['enddate'],
                            fullstartdate: rows[i]['fullstartdate'],
                            url: rows[i]['url'],
                            urlbase: rows[i]['urlbase'],
                            copyright: rows[i]['copyright'],
                            copyrightlink: rows[i]['copyrightlink'],
                            hsh: rows[i]['hsh'],
                            qiniu_url: rows[i]['qiniu_url'],
                            longitude: rows[i]['longitude'],
                            latitude: rows[i]['latitude'],
                            city: rows[i]['city'],
                            country: rows[i]['country'],
                            continent: rows[i]['continent'],
                            thumbnail_pic: rows[i]['thumbnail_pic'],
                            bmiddle_pic: rows[i]['bmiddle_pic'],
                            original_pic: rows[i]['original_pic'],
                            weibo: rows[i]['weibo'],
                            date: full
                        });
                    }
                    res.render('index', {
                        data: data,
                        title: '必应壁纸',
                        description: 'Bing 每日壁纸',
                        page: page
                    });
                }
            });
        }
    });
});
module.exports = router;