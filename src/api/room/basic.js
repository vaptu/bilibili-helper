// 获取直播间原始ID 已废弃
export function getRoomId (roomUrl) {
  return this.get({
    url: `live.bilibili.com/${roomUrl}`,
    html: true
  }).then(res => {
    let data = res
    let reg = data.match(/ROOMID \= (.*?)\;/)
    if (reg && reg.length >= 2) { return reg[1] } else { return roomUrl }
  })
}

export function getRoomBaseInfo (roomUrl) {
  return this.get({
    url: `api.live.bilibili.com/room/v1/Room/room_init?id=${roomUrl}`,
    params: {
      id: roomUrl
    }
  }).then(res => {
    let data = JSON.parse(res).data
    return {
      id: data['room_id'],
      shortId: data['short_id'],
      anchorId: data['uid']
    }
  })
}

// 获取直播间简介 已废弃
export function getRoomIntro (roomUrl) {
  return this.get({
    url: `live.bilibili.com/${roomUrl}`,
    html: true
  }).then(res => {
    let data = res
    let reg = data.match(/<div class="content-container" ms-html="roomIntro">([\S\s]*)<\/div>[.\s]*<\/div>[.\s]*<!-- Recommend Videos/)
    if (reg && reg.length >= 2) { return reg[1] } else { return '' }
  })
}

// 获取直播间信息
export function getRoomInfo () {
  return this.get({
    url: `api.live.bilibili.com/room/v1/Room/get_info`,
    params: {
      room_id: this.roomId,
      from: 'room',
    }
  }).then(res => {
    let data = JSON.parse(res).data
    let room = {}
    room.title = data['title']
    room.areaId = data['area_id']
    room.cover = data['user_cover']
    room.liveStatus = data['live_status']
    room.liveStartTime = data['live_time']
    return room
  }).then(room => {
    return this.get({
      url: 'api.live.bilibili.com/live_user/v1/UserInfo/get_anchor_in_room',
      params:{
        roomid: this.roomId
      }
    }).then(res => {
      let data = JSON.parse(res).data
      room.anchor = {
        id: data['info']['uid'],
        name: data['info']['uname']
      };

      return room
    })
  }).then( room => {
    return this.get({
      url: 'api.live.bilibili.com/feed/v1/feed/GetUserFc',
      params:{
        follow: room.anchor.id
      }
    }).then(res => {
      let data = JSON.parse(res).data
      room.fans = data['fc']
      return room
    })
  })
}

// 获取直播间历史弹幕
export function getRoomMessage () {
  return this.post({
    uri: 'ajax/msg',
    body: {
      roomid: this.roomId
    }
  }).then(res => {
    let data = JSON.parse(res)
    if (data.code == 0) {
      return data.data.room
    }
  })
}

// 获取直播间粉丝列表
export function getAnchorFollwerList (anchorId, page = 1, pageSize = 20) {
  return this.get({
    url: 'api.bilibili.com/x/relation/followers',
    params: {
      vmid: anchorId,
      pn: page,
      ps: pageSize
    }
  }).then(res => {
    let data = JSON.parse(res).data
    return data.list.map(follower => {
      return {
        id: follower.mid,
        name: follower.uname
      }
    })
  })
}

// 获取直播间房管列表
export function getRoomAdminList () {
  return this.post({
    uri: 'liveact/ajaxGetAdminList',
    body: {
      roomid: this.roomId
    }
  }).then(res => {
    let data = JSON.parse(res).data
    return data.map(admin => {
      return {
        id: admin.id,
        ctime: admin.ctime,
        admin: {
          id: admin.userinfo.uid,
          name: admin.userinfo.uname
        }
      }
    })
  })
}

// 获取被禁言用户列表
export function getRoomBlockList (page = 1) {
  return this.post({
    uri: 'liveact/ajaxGetBlockList',
    body: {
      roomid: this.roomId,
      page: page
    }
  }).then(res => {
    let data = JSON.parse(res).data
    return data.map((item) => {
      return {
        id: item.id,
        user: {
          id: item.uid,
          name: item.uname
        },
        admin: {
          id: item.adminid,
          name: item.admin_uname
        },
        ctime: item.ctime,
        etime: item.block_end_time
      }
    })
  })
}
