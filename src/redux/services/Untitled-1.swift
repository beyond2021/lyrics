// This file was generated from JSON Schema using quicktype, do not modify it directly.
// To parse the JSON, add this file to your project and do:
//
//   let rootObject = try RootObject(json)

import Foundation

// MARK: - RootObjectElement
struct RootObjectElement {
 let artists: [Artist]
 let highlightsurls: Highlightsurls
 let hub: Hub
 let images: Images
 let key, layout: String
 let properties: Highlightsurls
 let share: Share
 let subtitle, title: String
 let type: RootObjectType
 let url: String
}

// MARK: - Artist
struct Artist {
 let adamid, alias, id: String
}

// MARK: - Highlightsurls
struct Highlightsurls {
}

// MARK: - Hub
struct Hub {
 let actions: [Action]
 let displayname: Displayname
 let explicit: Bool
 let image: String
 let options: [Option]
 let type: HubType
}

// MARK: - Action
struct Action {
 let id: String?
 let name: Name
 let type: ActionType
 let uri: String?
}

enum Name {
 case apple
 case hubApplemusicDeeplink
}

enum ActionType {
 case applemusicopen
 case applemusicplay
 case uri
}

enum Displayname {
 case appleMusic
}

// MARK: - Option
struct Option {
 let actions: [Action]
 let beacondata: Beacondata
 let caption: Caption
 let colouroverflowimage: Bool
 let image: String
 let listcaption: Listcaption
 let overflowimage: String
 let providername: Providername
 let type: BeacondataType
}

// MARK: - Beacondata
struct Beacondata {
 let providername: Providername
 let type: BeacondataType
}

enum Providername {
 case applemusic
}

enum BeacondataType {
 case typeOpen
}

enum Caption {
 case captionOPEN
}

enum Listcaption {
 case openInAppleMusic
}

enum HubType {
 case applemusic
}

// MARK: - Images
struct Images {
 let background, coverart, coverarthq: String
 let joecolor: String
}

// MARK: - Share
struct Share {
 let avatar: String?
 let href, html: String
 let image: String
 let snapchat: String
 let subject, text, twitter: String
}

enum RootObjectType {
 case music
}
