# Hotkeys

# Tmux
default mod is ctrl-b
| desc                 | hotkey             | command             |
| -------------------- | ------------------ | ------------------- |
| list session         |                    | tmux ls             |
| new session          |                    | tmux new -s name    |
| attach session       |                    | tmux attach -t name |
| detach session       | mod d              |                     |
|                      |                    |                     |
| split horizontally   | mod %              |                     |
| split vertically     | mod "              |                     |
| pane change focus    | mod arrow keys     |                     |
| resize pane          | mod ctrl-arrow key |                     |
|                      |                    |                     |
| new window           | mod c              |                     |
| rename window        | mod ,              |                     |
| switch window        | mod #number        |                     |
| next window          | mod n              |                     |
| previous window      | mod p              |                     |
| list windows         | mod w              |                     |
| kill window          | mod &              |                     |

# atles vim
## File operations

| desc                 | hotkey   | command  |
| -------------------- | -------- | -------- |
| Nerdtree Toggle      | \<C-n\>  |          |
| Nerdtree Refresh     | \<r\>    |          |
| Ag silver search     |          | :Ag      |
| Fzf Git Files        | \<C-t\>  | :GFiles  |

## Window

| desc                   | hotkey           | command  |
| ---------------------- | ---------------- | -------- |
| Split vertically       | C-w s            | :split   |
| Split horizontally     | C-w v            | :vsplit  |
| move focus right       | C-w l            |          |
| move focus left        | C-w h            |          |
| move focus up          | C-w k            |          |
| move focus down        | C-w j            |          |
| increase width         | C-w >            |          |
| decrease width         | C-w <            |          |
| increase height        | C-w +            |          |
| decrease height        | C-w -            |          |
| equal height and width | C-w =            |          |

# atles dwm
| desc                               | hotkey          |
| ---------------------------------- | --------------- |
| Shift focus left                   | mod+j           |
| Shift focus right                  | mod+k           |
| Resize to the left                 | mod+h           |
| Resize to the right                | mod+l           |
| Tiled mode (default)               | mod+t           |
| Floating mode                      | mod+f           |
| Monocle mode                       | mod+m           |
| Quit window/application            | shift+mod+q     |
| Toggle tag visibility              | mod+[1-9]       |
| Move window to tag                 | shift+mod+[1-9] |
| Move window down stack             | mod+d           |
| Move window up stack               | mod+i           |
| Toggle floating on active window   | shift+mod+space |
| Toggle bar                         | mod+b           |
| Zoom active window to master stack | mod+return      |
| Toggle view                        | mod+tab         |